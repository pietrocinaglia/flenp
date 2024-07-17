const $modules = [
    { "type": "block", "title":"Block#", "description":"A block allows defining a set of linked-commands.", "statement":"", "statement_list":'["sequential","foreach"]'},
    { "type": "step", "title":"HISAT2", "description":"HISAT2", "cmd":"hisat2", "cmd_list":'["hisat2","hisat2 --merge","hisat2 --index"]'},
    { "type": "step", "title":"SAMtools", "description":"SAMtools", "cmd":"samtools", "cmd_list":'["samtools", "samtools sort", "samtools index"]' },
    { "type": "step", "title":"StringTie", "description":"StringTie", "cmd":"stringtie", "cmd_list":'["stringtie", "stringtie --merge"]' },
    { "type": "step", "title":"Custom", "description":"Custom command", "cmd":"", "cmd_list":'[]' },
];

/*
* Loader for $modules
*/
var $container = $('#toolbox-container');
for (let i = 0; i < $modules.length; i++) {
    let module_type = $modules[i].type;
    let module_statement = ($modules[i].statement == null ? null : $modules[i].statement);
    let module_statement_list = ($modules[i].statement == null ? null : btoa($modules[i].statement_list)) ;
    let module_title = $modules[i].title;
    let module_description = $modules[i].description;
    let module_cmd = ($modules[i].cmd == null ? null : $modules[i].cmd);
    let module_cmd_list = ($modules[i].cmd == null ? null : btoa($modules[i].cmd_list)) ;
    let module_icon = '';
    let button_label = module_title;
    let button_icon = '<i class="bi bi-arrows-move pull-right"></i>';
    let button_class = "toolbox-item draggable_operator"
    let button = '<div type="button" ' + 'class="' + (module_type == 'block' ? button_class += " create_block_button" : button_class) + '" data-nb-type="' + module_type + '" data-nb-title="' + module_title + '" data-nb-description="' + module_description + (module_type == 'step' ? ('" data-nb-cmd="' + module_cmd + '" data-nb-cmd_list="' + module_cmd_list) : '') + (module_type == 'block' ? ('" data-nb-statement="' + module_statement + '" data-nb-statement_list="' + module_statement_list )  : '') + '" data-nb-icon="' + module_icon + '">' + button_label + button_icon + '</div>';
    $container.append(button);
}
