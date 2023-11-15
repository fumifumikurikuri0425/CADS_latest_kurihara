# =================================================================================================
# Project: CADS/MADS - An Integrated Web-based Visual Platform for Materials Informatics
#          Hokkaido University (2018)
#          Last Update: Q3 2023
# ________________________________________________________________________________________________
# Authors: Kurihara Fumio [2023-]
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
# e.g.,coef=None:["Li", "K", "Mn"] -> ["LiKMn"]
# coef=2.22:["Li", "K", "Mn"] -> ["LiKMn2.22"]
def get_catalyst_list(df, coef):
    cat_array = df.values
    cat_delete_array = [cat[~(cat == ("none" or "None"))] for cat in cat_array]

    if coef == False:
        cat_join_array = ["".join(cat) for cat in cat_delete_array]
        return cat_join_array

    elif coef:
        tmp_list = []
        for cat in cat_delete_array:
            mix_array = [y for x in zip(cat, coef) for y in x]
            tmp_list.append(mix_array)
        cat_join_array = ["".join(cat) for cat in tmp_list]
        return cat_join_array


# -------------------------------------------------------------------------------------------------


# -------------------------------------------------------------------------------------------------
def get_coef_err(columns, num_list):
    try:
        # logger.info(str(columns) + " : " + str(len(columns)))
        # logger.info(str(num_list) + " : " + str(len(num_list)))
        assert len(columns) == len(num_list)
        return False
    except AssertionError:
        logger.info("coefficient and Feature Columns are not same length.")
        return True


# -------------------------------------------------------------------------------------------------


# -------------------------------------------------------------------------------------------------
def get_xenonpy(data):
    result = {}
    featurizers = [
        "WeightedAverage",
        "WeightedSum",
        # "WeightedVariance",
        # "MaxPooling",
        # "MinPooling",
    ]
    cal = Compositions(featurizers=featurizers)
    logger.info(data["view"]["settings"]["featurizer_Average"])

    if data["view"]["settings"]["method"] == "average":
        selected_columns = data["view"]["settings"]["featureColumns"]
        dataset = data["data"]
        df = pd.DataFrame(dataset)
        # logger.info(df)
        # logger.info(df.dtypes)

        catalyst_list = get_catalyst_list(df, coef=False)
        metal = [Composition(comp).as_dict() for comp in catalyst_list]
        df_descriptor = cal.transform(metal).round(5)
        final_df = pd.concat([df, df_descriptor], axis=1)
        # logger.info(final_df)

    elif data["view"]["settings"]["method"] == "weighted average":
        selected_columns = data["view"]["settings"]["featureColumns"]
        coef_1 = data["view"]["settings"]["coefficient1"]
        coef_2 = data["view"]["settings"]["coefficient2"]
        coef_3 = data["view"]["settings"]["coefficient3"]
        coef_4 = data["view"]["settings"]["coefficient4"]
        coef_5 = data["view"]["settings"]["coefficient5"]
        coef = [coef_1, coef_2, coef_3, coef_4, coef_5]
        # logger.info(coef)
        coef = [i for i in coef if i != 0]
        coef = [i for i in coef if i != "0"]
        is_error = get_coef_err(selected_columns, coef)
        if is_error:
            result["status"] = "error"
            result["detail"] = "coefficient and Feature Columns are not same length."
            return result
        # logger.info(coef)

        dataset = data["data"]
        df = pd.DataFrame(dataset)

        catalyst_list = get_catalyst_list(df, coef)
        metal = [Composition(comp).as_dict() for comp in catalyst_list]
        df_descriptor = cal.transform(metal).round(5)
        final_df = pd.concat([df, df_descriptor], axis=1)

    elif data["view"]["settings"]["method"] == "weighted from column":
        selected_columns = data["view"]["settings"]["featureColumns"]
        metal_1 = data["view"]["settings"]["metal1"]
        metal_2 = data["view"]["settings"]["metal2"]
        metal_3 = data["view"]["settings"]["metal3"]
        metal_4 = data["view"]["settings"]["metal4"]
        metal_5 = data["view"]["settings"]["metal5"]
        metals = [metal_1, metal_2, metal_3, metal_4, metal_5]
        metals = [m for m in metals if m != "None"]
        # logger.info(metals)

        dataset = data["data"]
        weight_df = pd.DataFrame(dataset)
        weighted_column = weight_df.values
        weighted_column_str = weighted_column.astype("str")
        tmp_list = []
        for wei in weighted_column_str:
            mix_array = [y for x in zip(metals, wei) for y in x]
            tmp_list.append(mix_array)
        catalyst_list = ["".join(cat) for cat in tmp_list]

        metal = [Composition(comp).as_dict() for comp in catalyst_list]
        df_descriptor = cal.transform(metal).round(5)
        final_df = df_descriptor
        final_df = pd.concat([weight_df, df_descriptor], axis=1)

    # --------------------------------------------------------------------------------------------------

    # --------------------------------------------------------------------------------------------------
    result["columns"] = final_df.columns
    # logger.info(result)
    result["data"] = final_df.to_dict(orient="records")
    # logger.info(result)

    return result


# -------------------------------------------------------------------------------------------------
