package com.resume.ats.check.models;

import lombok.Data;

import java.util.List;

@Data
public class SectionScore {
    private String name;
    private int score;
    private List<String> recommendations;
}
