import psutil # pip3 install psutil
import numpy as np # pip3 install numpy
import matplotlib.pyplot as plt # pip3 install matplotlib
import csv
import os
import time

###
# Configuration
workspace_path = os.path.dirname(os.path.abspath(__file__))
os.chdir( workspace_path )
create_log = True
plot_usage = False
sleep_time = 1 # seconds
###

for i in range(100000000):
    # Obtaining all the essential details
    cpu_usage = psutil.cpu_percent()
    mem_usage = psutil.virtual_memory().percent
    print("CPU: " + str(cpu_usage) + "% - " + "Memory: " + str(mem_usage) + "%")
    print("-----------------------------")

    if create_log:
        logfile = open("log.csv", "a", encoding='UTF8')
        writer = csv.writer(logfile)
        writer.writerow([i, cpu_usage, mem_usage])
        logfile.close()

    if plot_usage:
        plt.scatter(i, cpu_usage, color = "red")
        plt.scatter(i, mem_usage, color = "blue")
        plt.legend(["CPU", "Memory"], loc ="lower right")
        plt.pause(sleep_time)
    else:
        time.sleep(sleep_time)

if plot_usage:
    plt.show()