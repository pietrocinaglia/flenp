import json

def __build_pipeline(data, block_id, step):
    if data is None:
        data = {
            "name": "",
            "description": "",
            "author": "",
            "url": "",
            "help": "",
            "pipeline": {}
        }
    
    if block_id.startswith("Block#") and step is None:
        data["pipeline"][block_id] = {
            "params": "",
            "statement": "",
            "steps": []
        }
    elif block_id.startswith("Block#") and step is not None:
        data["pipeline"][block_id]['steps'].append({
            "name": step['properties']['title'], "description": "", "cmd": ""
        })

    return data

def __next(data, fromOperator):
    for _, link_info in data['links'].items():
        if str(link_info['fromOperator']) == str(fromOperator):
            for operator_id, operator_info in data['operators'].items():
                if str(operator_id) == str(link_info['toOperator']):
                    return operator_id, operator_info
    return False, None

def compile(data):
  blocks = {}
  for operator_id, operator_info in data['operators'].items():
      if operator_id.startswith("Block#"):
          blocks[operator_id] = operator_info['properties']['body']

  pipeline = None
  for block_id, block_data in blocks.items():
      print(block_data);
      pipeline = __build_pipeline(pipeline, block_id, None)
      fromOperator = block_id
      while fromOperator:
          fromOperator, operator_info = __next(fromOperator)
          if operator_info is None:
              break
          else:
              pipeline = __build_pipeline(pipeline, block_id, operator_info)

  pipeline = json.dumps(pipeline, indent=4)

  return pipeline