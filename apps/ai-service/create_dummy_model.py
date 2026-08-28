import onnx
from onnx import helper, TensorProto

# Create input and output tensors
input_tensor = helper.make_tensor_value_info('input', TensorProto.FLOAT, [1, 3, 224, 224])
output_tensor = helper.make_tensor_value_info('output', TensorProto.FLOAT, [1, 4])

# Create a Constant node that outputs [0.25, 0.25, 0.25, 0.25]
constant_node = helper.make_node(
    'Constant',
    inputs=[],
    outputs=['constant_output'],
    value=helper.make_tensor(
        name='const_tensor',
        data_type=TensorProto.FLOAT,
        dims=[1, 4],
        vals=[0.25, 0.25, 0.25, 0.25]
    )
)

# Identity node to forward the constant to the output
identity_node = helper.make_node(
    'Identity',
    inputs=['constant_output'],
    outputs=['output']
)

# Build the graph
graph = helper.make_graph(
    nodes=[constant_node, identity_node],
    name='dummy_model',
    inputs=[input_tensor],
    outputs=[output_tensor]
)

# Create the model with IR version 9 and a pinned opset (ONNX Runtime 1.20 supports up to opset 21)
model = helper.make_model(
    graph,
    producer_name='crop-ai-dummy',
    ir_version=9,
    opset_imports=[helper.make_opsetid("", 21)],
)

# Save the model
onnx.save(model, 'models/crop-disease.onnx')

print("Model created with IR version 9 at models/crop-disease.onnx")