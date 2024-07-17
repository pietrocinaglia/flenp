/*
* Compiling source code into FLENP's pipeline
*/

function _compilePipeline(data) {

	function _buildPipeline(data, block_data, step) {
		if (data === null) {
			data = {
				name: "",
				description: "",
				author: "",
				url: "",
				help: "",
				pipeline: {}
			};
		}

		if ( ! data.hasOwnProperty('pipeline') )
			pipeline.pipeline = {}
		if (step === null) {
			data.pipeline[block_data.title] = {
				params: "",
				statement: block_data.statement,
				steps: []
			};
		} else {
			data.pipeline[block_data.title].steps.push({
				name: step.properties.title,
				description: step.properties.description,
				cmd: step.properties.cmd,
			});
		}

		return data;
	}

	function _nextOperator(data, fromOperator) {
		for (let linkId in data.links) {
			let linkInfo = data.links[linkId];
			if (linkInfo.fromOperator.toString() === fromOperator.toString()) {
				for (let operatorId in data.operators) {
					let operatorInfo = data.operators[operatorId];
					if (operatorId.toString() === linkInfo.toOperator.toString()) {
						return { operatorId, operatorInfo };
					}
				}
			}
		}
		return { operatorId: false, operatorInfo: null };
	}

	/** Main */
	let blocks = {};
	for (let operatorId in data.pipeline.operators) {
		if (operatorId.startsWith("Block#")) {
			blocks[operatorId] = data.pipeline.operators[operatorId].properties;
		}
	}

	let pipeline = data.metadata;
	for (let blockId in blocks) {
		pipeline = _buildPipeline(pipeline, block_data=blocks[blockId], step=null);
		let fromOperator = blockId;
		while (fromOperator) {
			let { operatorId, operatorInfo } = _nextOperator(data.pipeline, fromOperator);
			if (operatorInfo === null) {
				break;
			} else {
				pipeline = _buildPipeline(pipeline, blockTitle=blocks[blockId], step=operatorInfo);
				fromOperator = operatorId;
			}
		}
	}

	pipeline = JSON.stringify(pipeline, null, 4);
	
	if (pipeline == "null")
		return "";

	return pipeline;
}