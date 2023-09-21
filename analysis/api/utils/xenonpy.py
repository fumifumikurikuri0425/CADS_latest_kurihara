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

from xenonpy.datatools import preset

preset.sync("elements_completed")
from xenonpy.descriptor import Compositions
from pymatgen.core import Composition

logger = logging.getLogger(__name__)

# -------------------------------------------------------------------------------------------------


# -------------------------------------------------------------------------------------------------
def get_catalyst_list(df, coef):
    cat_array = df.values
    if coef == 0:
        cat_delete_array = [cat[~(cat == "none")] for cat in cat_array]
        cat_join_array = ["".join(cat) for cat in cat_delete_array]
        return cat_join_array


# -------------------------------------------------------------------------------------------------


# -------------------------------------------------------------------------------------------------
def get_xenonpy(data):
    if data["view"]["settings"]["method"] == "average":
        selected_columns = data["view"]["settings"]["featureColumns"]
        dataset = data["data"]

        df = pd.DataFrame(dataset)

        catalyst_list = get_catalyst_list(df, coef=0)
        metal = [Composition(comp).as_dict() for comp in catalyst_list]

        cal = Compositions()
        df_descriptor = cal.transform(metal).round(5)
        final_df = pd.concat([df, df_descriptor], axis=1)
        # logger.info(final_df)
    # --------------------------------------------------------------------------------------------------

    # --------------------------------------------------------------------------------------------------
    elif data["view"]["settings"]["method"] == "weighted average":
        selected_columns = data["view"]["settings"]["featureColumns"]
        dataset = data["data"]

    # --------------------------------------------------------------------------------------------------

    # --------------------------------------------------------------------------------------------------
    result = {}
    result["columns"] = final_df.columns
    # logger.info(result)
    result["data"] = final_df.to_dict(orient="records")
    # logger.info(result)

    return result


# -------------------------------------------------------------------------------------------------
