from pandas import DataFrame, json_normalize, merge
from scipy.stats import chi2
import sys, json
sys.stdin.reconfigure(encoding='utf-8')
sys.stdout.reconfigure(encoding='utf-8')

def transform_input_to_df(data: list[str]) -> DataFrame:

    data_df: DataFrame = json_normalize(data)
    
    data_df = data_df.astype({
        'discharges': 'float',
        'observed': 'float', 
        'expected': 'float', 
        'ratio': 'float'
    })
    
    return data_df

def compute_confidence_intervals(
                                        standardized_data: DataFrame, 
                                        observed_col_name: str,
                                        expected_col_name: str
                                        ) -> DataFrame:

    ci_data = standardized_data

    ci_data['ci95_upper'] = chi2.ppf(0.975, 2*(ci_data[observed_col_name] + 1)) / (2*ci_data[expected_col_name])
    ci_data['ci95_lower'] = chi2.ppf(0.025, 2*(ci_data[observed_col_name])) / (2*ci_data[expected_col_name])

    return ci_data


def get_top10_significant(standarized_data: DataFrame):
    
    data = standarized_data \
                .query("ci95_upper > 1 and ci95_lower > 1") \
                .sort_values(by=["discharges"], ascending=False)
                
                
    return data


if __name__ == "__main__":

    data = input()
    data_parsed = json.loads(data, strict=False)

    data_df = transform_input_to_df(data_parsed)
    
    data_ci = compute_confidence_intervals(data_df, 'observed', 'expected')
    
    response = get_top10_significant(data_ci)

    sys.stdout.write(json.dumps(response.to_json(orient="records"), ensure_ascii=False))