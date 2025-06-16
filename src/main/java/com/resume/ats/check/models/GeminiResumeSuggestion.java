package com.resume.ats.check.models;

import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
public class GeminiResumeSuggestion {

    private String overallImpression;
    private Map<String, String> sectionSuggestions = new HashMap<>(); // e.g., Summary -> Suggestion
}
