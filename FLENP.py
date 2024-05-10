import os, psutil
import sys
import json
from jinja2 import Environment, FileSystemLoader
import subprocess
import multiprocessing
# Logging
import logging
from datetime import date

###
# @author: Pietro Cinaglia
# @mail: cinaglia (at) unicz (dot) it
# @github: https://github.com/pietrocinaglia
###

class FLENP:
    
    ############
    # Load Parameters from **kwargs testing
    ############
    
    ############
    # Initialization
    ############    
    def __init__(self, pipeline_template=None, kwargs=dict()):
        print(psutil.Process(os.getpid()).memory_info().rss / 1024 ** 2) 
        
        print( "****************************************************************************" )
        print( "* FLexible ENgine of Pipeline - FLENP                                      *" )
        print( "*                                                                          *" )
        print( "* Description: a versatile method for designing and                        *" )
        print( "*              parallel processing genomic pipelines.                      *" )
        print( "* Version:  1.1                                                            *" )
        print( "* GitHub:   https://github.com/pietrocinaglia/flenp                        *" )
        print( "* Help:     --help or -h                                                   *" )
        print( "****************************************************************************" )
        
        self.initEnv(kwargs)
        self.logger.info( "FLexible ENgine of Pipeline - FLENP")

        if pipeline_template is None:
            pipeline_template = input("Enter pipeline name:")

        pipeline, pipeline_template = self.loadPipeline(pipeline_template)

        self.executePipeline(pipeline, pipeline_template)

        print( "PIPELINE COMPLETED." )
        self.logger.info( "PIPELINE COMPLETED." )
    
    def initEnv(self, kwargs):
        self.currentPath = os.path.dirname(os.path.abspath(__file__))
        if '.dist' in self.currentPath:
            self.currentPath = "/".join( self.currentPath.split('/')[:-1] )
        print ("Workspace: " + self.currentPath)
        # Setting Workspace
        os.chdir( self.currentPath )        
        # Setting Logger
        logging.basicConfig(filename='log/'+date.today().strftime("%Y%m%d")+'.txt',
                    filemode='a',
                    format='%(asctime)s | %(levelname)s >> %(message)s',
                    datefmt='%H:%M:%S',
                    level=logging.DEBUG)
        self.logger = logging.getLogger('[FLENP]')
        ##

        self.params = {}
        self.params['THREADS'] = multiprocessing.cpu_count()
        self.params['WORKSPACE'] = self.currentPath
        self.loadInputKwargs(kwargs)
        
    def loadInputKwargs(self, kwargs):
        for key, value in kwargs.items():
            self.params[key] = value

    ############
    # Methods
    ############

    def loadPipeline(self, pipeline_template, render=False):
        if not render:
            self.env = Environment(loader=FileSystemLoader( self.currentPath ))
            pipeline_template = self.env.get_template(pipeline_template)

        pipeline = pipeline_template.render(self.params)
        pipeline = json.loads(pipeline)

        if render:
            return pipeline, pipeline_template

        print( 'Name: ' + pipeline['name'] )
        print( 'Description: ' + pipeline['description'] )
        print( 'Author: ' + pipeline['author'] )
        print( 'Url: ' + pipeline['url'] )
        print( 'Help: ' + pipeline['help'] )
        print() # \n

        for kblock, vblock in pipeline['pipeline'].items():
            params = pipeline['pipeline'][kblock]['params'].split(",")
            for p in params:
                if p not in self.params and p != '':
                    self.params[p] = input("Enter a value for " + p + ": ")

        print ( "PIPELINE LOADED [" + pipeline_template.filename + "]" )
        print ( " - Parameters: " + str(self.params) )
        self.logger.info( "PIPELINE LOADED [" + pipeline_template.filename + "]" )
        self.logger.info( " - parameters: " + str(self.params))

        return self.loadPipeline(pipeline_template, True)
    
    def executePipeline(self, pipeline, pipeline_template):

        for pkey, pdata in pipeline['pipeline'].items():
            statement = []
            if 'statement' not in pdata:
                self.executeSteps(pdata['steps'], False)
                return
            if len(pdata['statement']) == 0:
                self.executeSteps(pdata['steps'], False)
                return
            # Isolating statement for recognition
            statement = pdata['statement'].split(' ', 1)
            
            # Statements
            ## LOOP
            if statement[0] == 'foreach': # foreach OBJ in PATH
                statement = pdata['statement'].split(' ', 3) # 0-3 attributes for FOREACH OBJ IN PATH
                objs = self.scanDirectory( statement[3] )
                print ( " - Objects: " + str(len(objs)) + "\n" )
                self.logger.info( " - Objects: " + str(len(objs)) )
                for s in objs:
                    self.params[ statement[1] ] = s
                    steps = pipeline_template.render(self.params)
                    steps = json.loads(steps)['pipeline'][pkey]['steps']
                    self.executeSteps(steps, False)
            ## CONDITION
            elif statement[0] == 'if': # foreach OBJ in PATH
                statement = pdata['statement'].split(' ', 1) # 0-3 attributes for IF VAR CONDITION VALUE_CONDITION
                return # condition is not implemented
            ##
            else:
                print ( "[ERROR] STATEMENT IS NOT RECOGNIZED. PIPELINE STOPPED." )
                self.logger.info( "[ERROR] STATEMENT IS NOT RECOGNIZED. PIPELINE STOPPED." )

    def scanDirectory(self, path):
        for (dirpath, dirnames, filenames) in os.walk(path):
            return dirnames

    def executeSteps(self, step, parallel=False):
        for step in step:
            process = self.execute(step['cmd']) #execute process

            if process == '-1':
                print( "[ERROR] " + step['name'] + " generates an error. PIPELINE STOPPED." )
                self.logger.info( "[ERROR] " + step['name'] + " generates an error. PIPELINE STOPPED." )
                break

            print( step['name'] + " RUNNING with PID " + str(process.pid) )
            self.logger.info( step['name'] + " RUNNING with PID " + str(process.pid) )

            # Communication
            if not parallel:
                for line in process.stdout: # waiting for exit code
                    print( line.replace('\n', '') )
                    self.logger.info ( line.replace('\n', '') )
                self.logger.info( step['name'] + " COMPLETED." )

    def execute(self, cmd):
        cwd = self.currentPath + '/'
        try:
            p = subprocess.Popen(cmd, shell=True, cwd=cwd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)
        except AttributeError as error:
            return -1
        return p

############
# Main
if __name__ == "__main__":

    pipeline_template = None
    if len(sys.argv) > 1:
        pipeline_template=sys.argv[1]

    kwargs = dict()
    if len(sys.argv) > 2:
        kwargs = dict(arg.split('=') for arg in sys.argv[2:])

    FLENP(pipeline_template, kwargs) # Start
############