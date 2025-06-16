package com.resume.ats.check.models;

import lombok.Data;

import java.util.List;

@Data
public class GeminiAnalysisDTO {
    private int overallScore;
    private List<SectionScore> sections;
    private List<String> foundKeywords;
    private List<String> missingKeywords;
}