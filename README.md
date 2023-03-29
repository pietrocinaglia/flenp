# FLEMP

FLexible ENgine for Parallel Processing of Pipelines in Genomics (FLEMP) is a software tool to design and deploy automated pipelines for parallel processing of genomics data. It models a pipeline based on its own template, having a highly understandable and manipulable organization, to meet the operator's need for customization. A scientist may model an in-house custom pipeline able to execute all tools based on a command line interface (CLI). FLEMP supports the parallel processing, to efficiently analyze large datasets. It orchestrates the processing according to the steps defined within a given template, by maximizing the CPU usage during the computation.


FLEMP has been translated into a C program; it uses libpython and static C files of its own to execute in the same way as CPython does.
Note that the "requirements.txt" contains all dependancies need to FLEMP, as well as to "monitor.py". The latter is a Python script stand-alone executable to monitor CPU and Memory usage (plotting is also supported); we used it for testing only.

FLEMP supports Unix-like Operating Systems; note that FLEMP has been compiled for macOS, and tested on macOS Monterey (12.4, Intel).


## How to run FLEMP

> ./FLEMP pipeline.json SAMPLES_DIR=samples P1_TIME=5 P2_PAR1=P2 P2_TIME=5

Alternatively, you can insert parameters manually through:

> ./FLEMP pipeline.json

or:

> ./FLEMP


## Testing
A testing pipeline based on the module (i.e., 'test') located into 'modules' is available. Furthermore, a set of synthetic files (.fq.gz) are located into 'samples'.
Note that both testing module and synthetic files DO NOT PRODUCE an output, these are only for testing.
We invite you to use a real pipeline based on non-testing modules to produce a valid output.


## MIT License

Copyright (c) 2022

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
