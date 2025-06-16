package com.resume.ats.check.controller;

import java.io.IOException;

import com.resume.ats.check.models.BookingRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.resume.ats.check.models.ATSDetail;
import com.resume.ats.check.service.AtsCheckerService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class AtsCheckerController {
	
	private final AtsCheckerService atsCheckerService;

	@CrossOrigin(origins = "http://localhost:4200")
	@PostMapping("/check-resume")
	public ATSDetail generateAtsDetails(@RequestPart("file") MultipartFile file, @RequestPart("desc") String desc) throws IOException{
		return atsCheckerService.generateAtsDetails(file, desc,false,true);
	}

	@CrossOrigin(origins = "http://localhost:4200")
	@PostMapping("/api/bookings")
	public ResponseEntity<String> sendBookingEmail(@RequestBody BookingRequest booking) {
		try {
			atsCheckerService.sendBookingEmail(booking);
			return ResponseEntity.ok("Booking request sent successfully.");
		} catch (Exception e) {
			return ResponseEntity.status(500).body("Failed to send booking request: " + e.getMessage());
		}
	}

}