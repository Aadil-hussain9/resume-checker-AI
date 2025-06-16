package com.resume.ats.check.models;

import java.util.List;
import java.util.Set;

import lombok.Data;

@Data
public class ATSDetail {
	private Set<String> totalKeywords;
	private Set<String> unMatchedKeywords;
	private String matchPercentage;
	private GeminiAnalysisDTO geminiAnalysis;
}
