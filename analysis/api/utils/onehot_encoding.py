# =================================================================================================
# Project: CADS/MADS - An Integrated Web-based Visual Platform for Materials Informatics
#          Hokkaido University (2018)
#          Last Update: Q3 2023
# ________________________________________________________________________________________________
# Authors: Mikael Nicander Kuwahara (Lead Developer) [2021-]
# ________________________________________________________________________________________________
# Description: Serverside (Django) rest api utils for the 'Analysis' page involving
#              'statistics' component
# ------------------------------------------------------------------------------------------------
# Notes:  This is one of the REST API parts of the 'analysis' interface of the website that
#         allows serverside work for the 'statistics' component.
# ------------------------------------------------------------------------------------------------
# References: logging, numpy libs
# =================================================================================================

# -------------------------------------------------------------------------------------------------
# Import required Libraries
# -------------------------------------------------------------------------------------------------
import logging
import pandas as pd
import numpy as np

logger = logging.getLogger(__name__)

# -------------------------------------------------------------------------------------------------


# -------------------------------------------------------------------------------------------------
def get_onehot(data):
    selected_columns = data["view"]["settings"]["featureColumns"]
    drop_first = data["view"]["settings"]["dropFirst"]
    dataset = data["data"]

    df = pd.DataFrame(dataset)
    onehot = pd.get_dummies(
        df, columns=selected_columns, drop_first=drop_first, sparse=True, dtype="uint8"
    )
    # logger.info(onehot)

    result = {}
    result["columns"] = onehot.columns
    # logger.info(result)
    result["data"] = onehot.to_dict(orient="records")
    # logger.info(result)

    return result


# -------------------------------------------------------------------------------------------------
