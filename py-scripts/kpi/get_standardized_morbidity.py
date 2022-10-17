from pandas import DataFrame, json_normalize, merge
from scipy.stats import chi2
import sys, json
sys.stdin.reconfigure(encoding='utf-8')
sys.stdout.reconfigure(encoding='utf-8')

def transform_input_to_df(data: list[str]) -> DataFrame:

    data_df: DataFrame = json_normalize(data)
    return data_df

def merge_model_and_target(model_data: DataFrame, target_data: DataFrame) -> DataFrame:

    model_selected_columns: list[str] = ['c_age', 'gender', 'morbidity_model']
    join_columns: list[str] = ['c_age', 'gender']

    merged_data: DataFrame = merge(
                                target_data, 
                                model_data[model_selected_columns], 
                                how="left",
                                left_on=join_columns,
                                right_on=join_columns)
    
    merged_data = merged_data.astype({
        'population': 'int', 
        'observed_discharges': 'float', 
        'morbidity_model': 'float'
        })

    merged_data['expected_discharges'] = merged_data['population'] * merged_data['morbidity_model']

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

def standardize_morbidity_by_entities(
                                    merged_data: DataFrame,
                                    observed_col_name: str,
                                    expected_col_name: str
                                    ):

    entities_col: list[str] = ['target_entities']

    standarditzation = merged_data \
                                    .groupby(entities_col) \
                                    .agg({
                                            observed_col_name: 'sum',
                                            expected_col_name: 'sum',
                                            "population": 'sum'
                                        }).reset_index()

    standarditzation['observed_morbidity'] = ( standarditzation[observed_col_name]/ standarditzation['population'] ) * 100000
    standarditzation['expected_morbidity'] = ( standarditzation[expected_col_name] / standarditzation['population'] ) * 100000

    standarditzation['ratio'] = standarditzation['observed_morbidity'] / standarditzation['expected_morbidity']

    standarditzation = compute_confidence_intervals(standarditzation, observed_col_name, expected_col_name)
    standarditzation = standarditzation.sort_values(by=["ratio"])

    return standarditzation

def standardize_morbidity_by_gender(merged_data: DataFrame,
                                observed_col_name: str,
                                expected_col_name: str,
                                selected_entity: str):

    gender_col: list[str] = ['target_entities', 'gender']

    standarditzation = merged_data \
                                    .groupby(gender_col) \
                                    .agg({
                                            observed_col_name: 'sum',
                                            expected_col_name: 'sum',
                                            "population": 'sum'
                                        }).reset_index()

    standarditzation['observed_morbidity'] = ( standarditzation[observed_col_name]/ standarditzation['population'] ) * 100000
    standarditzation['expected_morbidity'] = ( standarditzation[expected_col_name] / standarditzation['population'] ) * 100000

    standarditzation['ratio'] = standarditzation['observed_morbidity'] / standarditzation['expected_morbidity']

    standarditzation = compute_confidence_intervals(standarditzation, observed_col_name, expected_col_name)
    standarditzation = standarditzation.sort_values(by=["gender"])

    return standarditzation



if __name__ == "__main__":

    data = input()
    data_parsed = json.loads(data, strict=False)
    model_data = data_parsed['model_data']
    target_data = data_parsed['target_data']
    selected_entity = data_parsed['selected_entity']

    model_data = transform_input_to_df(model_data)
    target_data = transform_input_to_df(target_data)

    merged_data = merge_model_and_target(model_data, target_data)

    entities_data = standardize_morbidity_by_entities(merged_data, "observed_discharges", "expected_discharges")
    gender_data = standardize_morbidity_by_gender(merged_data, "observed_discharges", "expected_discharges", selected_entity)

    response = {
        'entities_data': entities_data.to_json(orient="records"),
        'gender_data': gender_data.to_json(orient="records")
    }

    sys.stdout.write(json.dumps(response, ensure_ascii=False))