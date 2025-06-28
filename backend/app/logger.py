# TODO: improve logging in future
import logging
import os
from logging.handlers import RotatingFileHandler

import colorama
import coloredlogs

# log dir
log_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "logs"))

if not os.path.exists(log_dir):
    os.makedirs(log_dir)

log_file = os.path.join(log_dir, "app.log")

# removing old logs file if they exist.
if os.path.exists(log_file):
    os.remove(log_file)

# Get the root logger
logger = logging.getLogger("Enkrypt-Chan")
logger.setLevel(logging.INFO)
logger.propagate = False

# Handlers
stream_handler = logging.StreamHandler()
file_handler = RotatingFileHandler(
    log_file, mode="w+", maxBytes=5000000, backupCount=10
)


# Formatter
def colored(txt, color=None, bright=False, dim=False):
    if bright:
        style = colorama.Style.BRIGHT
    elif dim:
        style = colorama.Style.DIM
    else:
        style = colorama.Style.NORMAL

    return color + style + txt + colorama.Style.RESET_ALL


# coloring format modules
filename = colored("%(filename)s", color=colorama.Fore.LIGHTBLUE_EX, bright=True)
lineno = colored("%(lineno)d", color=colorama.Fore.MAGENTA, bright=True)
funcName = colored("%(funcName)s()", color=colorama.Fore.CYAN, bright=True)

# setup format
log_format = f"[%(asctime)s - %(levelname)s] - %(name)s - {filename}:{lineno}:{funcName} - %(message)s"
date_format = "%d-%b-%y %H:%M:%S"
formatter = logging.Formatter(log_format, date_format)

stream_handler.setFormatter(formatter)
file_handler.setFormatter(formatter)

# Set handlers
logger.addHandler(stream_handler)
logger.addHandler(file_handler)

# Colored logs
coloredlogs.install(level="INFO", logger=logger, fmt=log_format, datefmt=date_format)
