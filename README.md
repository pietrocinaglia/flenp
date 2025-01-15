# FLENP Project

*FLexible ENgine of Pipeline* (*FLENP*) is a versatile solution for designing and parallel processing genomic pipelines. 

*FLENP* project is released in two (independent) modules: *FLENP - ENGINE* (or *FLENP*, simply) and *FLENP - DESIGNER* (*fDESI*). The former is able to execute pipelines in its own format, the latter allows designing and configuring them; a non-exhaustive example of pipeline fo Transcript-level Quantification from RNA-seq is also included (it can be directly executed by *FLENP - ENGINE*).

*fDESI* is available as web-based tool with Graphical User Interface (GUI).


### References

> Pietro Cinaglia. 2024. A Lightweight Method for Designing and Massive Processing of Genomics Pipelines. IEEE Access, vol. 12, pp. 168245-168255. DOI: 10.1109/ACCESS.2024.3464867


## *FLENP - DESIGNER* (*fDESI*)

*fDESI* is a web-based tool, which allows building pipeline (for *FLENP - ENGINE*) via a user-friendly GUI based on drag-and-drop.

Note that a minimal set of modules is only included, however, you can add your own modules in according to *FLENP - ENGINE* requirements by using JSON.

*fDESI* is freely available at https://pietrocinaglia.github.io/flenp

Note that for the full-features which include the support to thirdy-party (self-implemented) modules, it can also be downloaded from this repositor, for hosting on a private remote/local environment; it only requires HTML, Javascript, and CSS.


## *FLENP - ENGINE* (or *FLENP*, simply)

How to run *FLENP - ENGINE*:

> python3 FLENP.py pipeline.json SAMPLES_DIR=samples P1_TIME=5 P2_PAR1=P2 P2_TIME=5

Alternatively, you can insert parameters manually through:

> python3 FLENP.py pipeline.json

or:

> python3 FLENP.py


#### Additional Information

- *FLENP - ENGINE* supports Python3 and Unix-like Operating Systems; it has been tested on MacOS.

- "requirements.txt" contains all dependancies need to *FLENP - ENGINE*, as well as to "monitor.py". The latter is a Python script stand-alone executable to monitor CPU and Memory usage (plotting is also supported); we used it for testing only.


#### Testing

A testing pipeline based on the module (i.e., 'test') located into 'modules' is available. Furthermore, a set of synthetic files (.fq.gz) are located into 'samples'.
Note that both testing module and synthetic files DO NOT PRODUCE an output, these are only for testing.
We invite you to use a real pipeline based on non-testing modules to produce a valid output.


#### How To Dockerize Your Pipeline
You can run *FLENP - ENGINE* in a Docker container by dockerizing your pipeline.

"docker-example" contains a DockerFile able to run a FLENP's pipeline, as well as a bash script for resolving dependences and installing modules. Note that you need to define your directives, based on your pipeline and the related third-party modules of interest.


## License

MIT License

Copyright (c) Pietro Cinaglia

Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the "Software"), to dealin the Software without restriction, including without limitation the rightsto use, copy, modify, merge, publish, distribute, sublicense, and/or sellcopies of the Software, and to permit persons to whom the Software isfurnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in allcopies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS ORIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THEAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHERLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THESOFTWARE.