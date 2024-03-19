# FLENP

FLexible ENgine of Pipeline (FLENP) is a versatile method for designing and parallel processing genomic pipelines. 

It is implemented as a software tool able to configure and deploy automated pipelines, e.g., for Transcript-level Quantification from RNA-seq (see example).

Note that the "requirements.txt" contains all dependancies need to FLENP, as well as to "monitor.py". The latter is a Python script stand-alone executable to monitor CPU and Memory usage (plotting is also supported); we used it for testing only.


## How to run FLENP

> python3 FLENP.py pipeline.json SAMPLES_DIR=samples P1_TIME=5 P2_PAR1=P2 P2_TIME=5

Alternatively, you can insert parameters manually through:

> python3 FLENP.py pipeline.json

or:

> python3 FLENP.py

Notes: FLENP supports Python3 and Unix-like Operating Systems; it has been tested on MacOS.


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