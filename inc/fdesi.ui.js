var block_last_id = 0;
/* offcanvas */
var offcanvasElement = document.getElementById("properties_offcanvas"); 
var offcanvas = new bootstrap.Offcanvas(offcanvasElement);

$(function(){
    onPageLoad();
});

function onPageLoad(){
	$('#export_data').click(exportData);
	$('#compile_pipeline').click(compilePipeline);
	//$('#create_block').click(createBlock);
	$('#setOperatorData').click(setOperatorData);
	$('#download_button').click(downloadPipeline);
	$('#add_module_button').click(addModule);
	$('#run_button').click(runPipeline);
	
	var $flowchart = $('#flowchartworkspace');
	var $container = $flowchart.parent();

	$flowchart.flowchart({
		data: {},
		grid: 20,
		linkWidth: 3,
		defaultLinkColor: '#3366ff',
        defaultSelectedLinkColor: 'red',
		multipleLinksOnInput: false,
		multipleLinksOnOutput: false,
		onOperatorSelect: function(operator_id) {
			offcanvas.hide();
			var operatorData = $flowchart.flowchart('getOperatorData', operator_id);
			$('#operator_data_title').html(operatorData.properties.title)
			operatorScaffolding(operatorData.properties)
			offcanvas.toggle();
			return true;
		},
		onOperatorUnselect: function() {
			return true;
		},
		onLinkSelect: function(link_id) {
			$flowchart.flowchart('deleteLink', link_id)
			return true;
		},
		onLinkUnselect: function() {
			return true;
		},
		onOperatorDelete: function (operator_id) {
			return true;
		},
		onLinkDelete: function (link_id, forced) {
			return true;
		},
	});

	function getOperatorData($element) {
		var nbType = $element.data('nb-type');
		nbType = ( nbType == null ? 'step' : nbType );

		var nbTitle = $element.data('nb-title');

		var nbInputs = null;
		var nbCmd = null;
		var nbCmd_list = null;
		var nbStatement = null;
		var nbStatement_list = null;

		if (nbType == 'block') {
			nbTitle = 'Block#' + block_last_id;
			nbStatement = $element.data('nb-statement');
			nbStatement = ( nbStatement == null ? null : nbStatement );
			nbStatement_list = $element.data('nb-statement_list');
			nbStatement_list = ( nbStatement_list == null ? null : JSON.parse(atob(nbStatement_list)) );
		}else if (nbType == 'step') {
			nbTitle = ( nbTitle == null ? '&nbsp' : nbTitle );
			nbInputs = $element.data('nb-inputs');
			nbInputs = ( nbInputs == null ? JSON.parse('{"prev": {}}') : nbInputs );
			nbCmd = $element.data('nb-cmd');
			nbCmd = ( nbCmd == null ? null : nbCmd );
			nbCmd_list = $element.data('nb-cmd_list');
			nbCmd_list = ( nbCmd_list == null ? null : JSON.parse(atob(nbCmd_list)) );
		}
		
		var nbDescription = $element.data('nb-description');
		nbDescription = ( nbDescription == null ? '' : nbDescription );

		var nbOutputs = $element.data('nb-outputs');
		nbOutputs = ( nbOutputs == null ? JSON.parse('{"next": {}}') : nbOutputs );

		var data = {
			properties: {
				type: nbType,
				title: nbTitle,
				description: nbDescription,
				statement: nbStatement,
				statement_list: nbStatement_list,
				cmd: nbCmd,
				cmd_list: nbCmd_list,
				inputs: nbInputs,
				outputs: nbOutputs
			}
		};
		return data;
	}

	function setOperatorData() {
		var selectedOperatorId = $flowchart.flowchart('getSelectedOperatorId');
		var operatorData = $flowchart.flowchart('getOperatorData', selectedOperatorId);
		
		$.each(operatorData.properties, function(key, obj) {
			if (key == 'type' || key == 'inputs' || key == 'outputs' || key == 'cmd_list' || key == 'statement_list' || obj == null)
				return true;
			let value = null;
			if (key == 'cmd') {
				value = (key == 'cmd' ? $('#cmd_list').val()[0] : $('#'+key).val());
			} else if (key == 'statement') {
				value = (key == 'statement' ? $('#statement_list').val()[0] : $('#'+key).val());
			}
			value = (value == null ? $('#'+key).val() : value);
			operatorData.properties[key] = value;
		});

		if (selectedOperatorId != null) {
			$flowchart.flowchart('setOperatorData', selectedOperatorId, operatorData);
		}
		offcanvas.hide();
	}

	//-----------------------------------------
	//--- draggable operators
	var $draggableOperators = $('.draggable_operator');
	$draggableOperators.draggable({
		cursor: "move",
		opacity: 0.7,
		appendTo: 'body',
		zIndex: 1000,
		//helper: 'clone',
		helper: function(e) {
			var $this = $(this);
			var data = getOperatorData($this);
			return $flowchart.flowchart('getOperatorElement', data);
		},
		stop: function(e, ui) {
			var $this = $(this);
			var elOffset = ui.offset;
			var containerOffset = $container.offset();
			if (elOffset.left > containerOffset.left &&
				elOffset.top > containerOffset.top &&
				elOffset.left < containerOffset.left + $container.width() &&
				elOffset.top < containerOffset.top + $container.height()) {
				var flowchartOffset = $flowchart.offset();
				var relativeLeft = elOffset.left - flowchartOffset.left;
				var relativeTop = elOffset.top - flowchartOffset.top;
				var positionRatio = $flowchart.flowchart('getPositionRatio');
				relativeLeft /= positionRatio;
				relativeTop /= positionRatio;
				var data = getOperatorData($this);
				data.left = relativeLeft;
				data.top = relativeTop;
				if (data.properties.type == 'block'){
					$operatorId = 'Block#' + block_last_id;
					$flowchart.flowchart('createOperator', $operatorId, data);
					block_last_id++;
				}else{
					$flowchart.flowchart('addOperator', data);
				}
			}
			
		}
	});
}
//--------------------------------------------------------------
//--- Download Pipeline
function downloadPipeline() {
	var pipeline_name = $('#pipeline_name').val();
	
	var filename = pipeline_name;
	if (filename == "" || filename == "undefined" || filename == null){
		filename = "pipeline";
	} else{
		filename = filename.toLowerCase()
		filename = filename.trim();
		filename = filename.replace(/ /g, "_")
	}

	var data = compilePipeline();

	var blob = new Blob([data], {type: "application/json"});
	var url = URL.createObjectURL(blob);
	var a = document.createElement('a');
	a.download = filename + '.json';
	a.href = url;
	a.id = filename;
	document.body.appendChild(a);
	a.click();
	return;
}
//--- Export
function exportData() {
	let flowchart_data = {}	
	flowchart_data.metadata = {
		name: $('#pipeline_name').val(),
		description: $('#pipeline_description').val(),
		author: $('#pipeline_author').val(),
		url: $('#pipeline_url').val(),
		help: $('#pipeline_help').val(),
	};

	flowchart_data.pipeline = $('#flowchartworkspace').flowchart('getData');
	
	$('#flowchart_data').val(JSON.stringify(flowchart_data, null, 2));
	return flowchart_data
}
//--- Compile
function compilePipeline() {
	var data = exportData();
	pipeline = _compilePipeline(data);

	$('#pipeline_data').val(pipeline);
	return pipeline;
}
//--- Add Module
function addModule($element) {
	// This function call FLENP-engine on cloud by passing the pipeline as input; local running can be also performed by downloading FLENP-engine.
	cmd_list = [];

	if ($('#new-module-cmd-list').val().length == 0){
		alert("[ERROR] You must specify at least one command that can be called from the shell.");
		return;
	} else {
		cmd_list = $('#new-module-cmd-list').val().split('\n');
	}

	var module = {
		type: 'step',
		title: $('#new-module-title').val(),
		description: $('#new-module-description').val(),
		cmd: cmd_list[0],
		cmd_list: JSON.stringify(cmd_list)
	};

	add_module_in_dashboard(module);
	$('#add_module_modal_view').modal('hide');

	onPageLoad();
}
//--- Run Pipeline
function runPipeline() {
	// This function call FLENP-engine on cloud by passing the pipeline as input; local running can be also performed by downloading FLENP-engine.
	alert("Running the pipeline online is disabled in preview mode... sorry, our resources are limited :-( However, you can download FLENP-engine from GitHub and run your pipeline locally, after downloading it.");
}
//--- Scaffolding Operator's properties
function operatorScaffolding(data) {
	var operator_data_description = $('#operator_data_description');
	operator_data_description.html(""); // clean content before scaffolding

	$.each(data, function(key, obj) {
		if (key == 'type' || key == 'inputs' || key == 'outputs' || obj == 'undefined' || obj == null)
			return true;

		label = key.charAt(0).toUpperCase() + key.slice(1);
		label = label.replace("_"," ");

		let html = '<div class="row"><label for="' + (key == 'cmd_list' ? 'cmd' : key) + (key == 'statement_list' ? 'statement' : key) + '" class="col-form-label col-form-label-sm">' + label + '</label><div class="">';
		
		if (Array.isArray(obj)){
			html += '<select class="form-select form-select-sm" multiple aria-label="multiple select" id="' + key + '">';
			for(let i=0; i<obj.length; i++){
				/*if (i==0)
					html += '<option value="' + obj[i] + '" selected>' + obj[i] + '</option>';
				else*/
					html += '<option value="' + obj[i] + '">' + obj[i] + '</option>';
			}
			html += '</select>';
		} else{
			html += '<input type="text" class="form-control form-control-sm" id="' + key + '" value="' + obj + '">';
		}
		html += '</div></div>';
		html = $(html)
		html.appendTo(operator_data_description);
	});
}
/*
//--- Import
function importData() {
	var data = JSON.parse($('#flowchart_data').val());
	//flowchart_data.metadata INTO text-fields
	$('#flowchartworkspace').flowchart('setData', flowchart_data.pipeline);
}
$('#import_data').click(importData);
*/
//--------------------------------------------------------------
//--- Create Operator
/*
function createBlock() {
	$flowchart = $('#flowchartworkspace');
	var operatorId = 'Block#' + block_last_id;
	var operatorData = {
		top: 30,
		left: 30 + (block_last_id * 150),
		properties: {
			type: "block",
			title: operatorId,
			description: "",
			inputs: {"prev": {}},
			outputs: {"next": {}}
		}
	};
	$flowchart.flowchart('createOperator', operatorId, operatorData);
	block_last_id++;
}
*/
//--------------------------------------------------------------