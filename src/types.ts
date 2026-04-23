export interface DeltaMinuteRow {
  min_bin: string;
  fav_label: 'Favorite' | 'Underdog';
  n: number;
  median: number;
}

export interface DeltaOddsBinRow {
  odds_bin: string;
  n: number;
  median_delta: number;
  mean_delta: number;
  std_delta: number;
  p25: number;
  p75: number;
}

export interface ThetaParamsRow {
  group: string;
  label: string;
  n_segments: number | null;
  a_fit: number | null;
  b_fit: number | null;
  SE_a: number | null;
  SE_b: number | null;
  lambda?: number;
}

export interface ThetaAccelRow {
  group: string;
  label: string;
  n: number;
  early_theta: number;
  late_theta: number;
  accel_ratio: number;
  W: number;
  p_value: number;
}

export interface GammaHeatmapRow {
  min_bin: string;
  score_diff_clamp: number;
  n: number;
  med_delta: number;
}

export interface ReactionSpeedRow {
  competition: string;
  event_type: string;
  n: number;
  median_tte_s: number;
  mean_tte_s: number;
  ci_lo_95: number;
  ci_hi_95: number;
  pct_stabilized: number;
  median_overshoot: number;
}

export interface OverreactionRow {
  group: string;
  n: number;
  median_overshoot: number;
  mean_overshoot: number;
  ci_lo_95: number;
  ci_hi_95: number;
  wilcoxon_stat: number;
  wilcoxon_p: number;
  pct_positive: number;
}

export interface CalibrationRow {
  bin: string;
  n: number;
  implied_prob: number;
  actual_rate: number;
  actual_se: number;
  chi2_stat: number;
  chi2_p: number;
  brier_score: number;
}
