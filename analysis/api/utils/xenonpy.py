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
def get_xenonpy(data):
    selected_columns = data["view"]["settings"]["featureColumns"]
    dataset = data["data"]

    df = pd.DataFrame(dataset)
    logger.info(df)
    df_feature = df[selected_columns]

    catalyst_list = []
    set_index = []
    for index, row in df_feature.iterrows():
        element_row = []
        for column_name, item in df_feature.items():
            temp = row[column_name]
            if temp != "none":
                element_row.append(temp)
        if element_row:
            result = "".join(element_row)
            catalyst_list.append(result)
            set_index.append(index)
    df_notnan = df.loc[set_index]
    metal = [Composition(comp).as_dict() for comp in catalyst_list]

    cal = Compositions()
    df_descriptor = cal.transform(metal).round(5)
    df_descriptor["index"] = set_index
    df_descriptor.set_index("index", inplace=True)
    final_df = pd.concat([df_notnan, df_descriptor], axis=1)
    logger.info(final_df)

    result = {}
    result["columns"] = final_df.columns
    # logger.info(result)
    result["data"] = final_df.to_dict(orient="records")
    # logger.info(result)

    return result


# -------------------------------------------------------------------------------------------------
