from pandas import DataFrame, json_normalize, merge
from scipy.stats import chi2
import sys, json
sys.stdin.reconfigure(encoding='utf-8')
sys.stdout.reconfigure(encoding='utf-8')

def transform_input_to_df(data: list[str]) -> DataFrame:

    data_df: DataFrame = json_normalize(data)
    return data_df

def merge_model_and_target(model_data: DataFrame, target_data: DataFrame) -> DataFrame:

    model_selected_columns: list[str] = ['c_age', 'gender', 'ccsr', 'dx_type', 'mortality_model']
    join_columns: list[str] = ['c_age', 'gender', 'ccsr', 'dx_type']

    merged_data: DataFrame = merge(
                                target_data, 
                                model_data[model_selected_columns], 
                                how="left",
                                left_on=join_columns,
                                right_on=join_columns)
    
    merged_data = merged_data.astype({
        'discharges': 'float', 
        'observed_exitus': 'float', 
        'mortality_model': 'float'
        })

    merged_data['expected_exitus'] = merged_data['discharges'] * merged_data['mortality_model']

    return merged_data

def compute_confidence_intervals(
                                        standardized_data: DataFrame, 
                                        observed_col_name: str,
                                        expected_col_name: str
                                        ) -> DataFrame:

    ci_data = standardized_data

    ci_data['ci95_upper'] = chi2.ppf(0.975, 2*(ci_data[observed_col_name] + 1)) / (2*ci_data[expected_col_name])
    ci_data['ci95_lower'] = chi2.ppf(0.025, 2*(ci_data[observed_col_name])) / (2*ci_data[expected_col_name])

    return ci_data

def standardize_mortality_by_entities(
                                    data: DataFrame,
                                    observed_col_name: str,
                                    expected_col_name: str
                                    ):

    entities_col: list[str] = ['target_entities']

    data = data.astype({
        'observed_exitus': 'float', 
        'expected_exitus': 'float',
        'ratio': 'float'
        })

    standarditzation = data \
                                    .groupby(entities_col) \
                                    .agg({
                                            observed_col_name: 'sum',
                                            expected_col_name: 'sum'
                                        }).reset_index()

    standarditzation['ratio'] = standarditzation[observed_col_name] / standarditzation[expected_col_name]

    standarditzation = compute_confidence_intervals(standarditzation, observed_col_name, expected_col_name)
    standarditzation = standarditzation.sort_values(by=["ratio"])

    return standarditzation

def standardize_mortality_by_gender(data: DataFrame,
                                observed_col_name: str,
                                expected_col_name: str):

    # gender_col: list[str] = ['target_entities', 'gender']

    standarditzation = data.astype({
        'observed_exitus': 'float', 
        'expected_exitus': 'float',
        'ratio': 'float'
        })

    standarditzation = compute_confidence_intervals(standarditzation, observed_col_name, expected_col_name)
    standarditzation = standarditzation.sort_values(by=["gender"])

    return standarditzation



if __name__ == "__main__":

    data = input()
    data_parsed = json.loads(data, strict=False)

    data_df = transform_input_to_df(data_parsed)

    entities_data = standardize_mortality_by_entities(data_df, "observed_exitus", "expected_exitus")
    gender_data = standardize_mortality_by_gender(data_df, "observed_exitus", "expected_exitus")

    response = {
        'entities_data': entities_data.to_json(orient="records"),
        'gender_data': gender_data.to_json(orient="records")
    }

    sys.stdout.write(json.dumps(response, ensure_ascii=False))