package com.resume.ats.check.models;

import lombok.Data;

@Data
public class BookingRequest {
    public String name;
    public String email;
    public String phone;
    public String date;
    public String time;
}

