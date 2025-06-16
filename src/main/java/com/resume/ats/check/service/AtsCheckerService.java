package com.resume.ats.check.service;

import java.io.IOException;
import java.util.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.resume.ats.check.models.BookingRequest;
import com.resume.ats.check.models.GeminiAnalysisDTO;
import com.resume.ats.check.models.GeminiResumeSuggestion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.stereotype.Service;

import com.resume.ats.check.models.ATSDetail;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AtsCheckerService {

    private final KeywordExtractorService keywordExtractorService;
    private final ScanPdfService scanPdfService;

    @Autowired
    private JavaMailSender mailSender;

    // Replace this with your admin email
    private final String adminEmail = "daradil639@gmail.com";

    @Value("${huggingface.api.token}")
    private String huggingFaceToken; // Store your Hugging Face API token in application.properties

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.ats.prompt}")
    private String geminiPromptTemplate;

    private final String HUGGING_FACE_API_URL = "https://api-inference.huggingface.co/models/dbmdz/bert-large-cased-finetuned-conll03-english";
    private final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + geminiApiKey;

    public ATSDetail generateAtsDetails(MultipartFile file, String desc, boolean aiCheck, boolean geminiCheck) throws IOException {

        ATSDetail atsDetail = new ATSDetail();

        // Step 1: Extract the content from the PDF file
        String pdfContent = scanPdfService.scanPdfFromFile(file);

        // Step 2: Extract keywords from job description
        atsDetail.setTotalKeywords(keywordExtractorService.extractKeywords(desc));

        // Step 3: Match keywords from the PDF content (if aiCheck is false)
        Set<String> unmatchedKeywords = new HashSet<>();
        Set<String> matchedKeywords = new HashSet<>();

        for (String keyword : atsDetail.getTotalKeywords()) {
            keyword = keyword.toLowerCase();
            if (pdfContent.contains(keyword)) {
                matchedKeywords.add(keyword);
            } else {
                unmatchedKeywords.add(keyword);
            }
        }

        atsDetail.setUnMatchedKeywords(unmatchedKeywords);

        // Step 4: If aiCheck is true, use Hugging Face API for keyword extraction (using NER)
        if (aiCheck) {
            Set<String> extractedEntities = extractEntitiesUsingHuggingFace(pdfContent);
            // Combine extracted entities with job description keywords
            for (String entity : extractedEntities) {
                if (pdfContent.contains(entity)) {
                    matchedKeywords.add(entity);
                } else {
                    unmatchedKeywords.add(entity);
                }
            }
        }

        // Step 5: If geminiCheck is true, use Gemini API for suggestions
        if (geminiCheck) {
            GeminiAnalysisDTO geminiResponse = callGeminiApi(pdfContent, desc);
            if (geminiResponse != null) {
                atsDetail.setGeminiAnalysis(geminiResponse); // Use the structured response directly
            }
        }

        // Step 6: Calculate match percentage
        double percentage = (double) matchedKeywords.size() / atsDetail.getTotalKeywords().size() * 100;
        atsDetail.setMatchPercentage(String.format("%.2f", percentage) + "% of keywords matched");

        return atsDetail;
    }

    /**
     * Extract named entities from the resume using Hugging Face API (NER model).
     */
    private Set<String> extractEntitiesUsingHuggingFace(String pdfContent) {
        Set<String> entities = new HashSet<>();

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + huggingFaceToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        String requestBody = "{\"inputs\": \"" + pdfContent + "\"}";
        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Object> response = restTemplate.exchange(
                    HUGGING_FACE_API_URL, HttpMethod.POST, entity, Object.class);

            if (response.getBody() instanceof List) {
                List<?> responseList = (List<?>) response.getBody();

                StringBuilder currentEntity = new StringBuilder();
                for (Object obj : responseList) {
                    if (obj instanceof Map) {
                        Map<?, ?> entityMap = (Map<?, ?>) obj;
                        String word = (String) entityMap.get("word");

                        if (word.startsWith("##")) {
                            currentEntity.append(word.substring(2));
                        } else {
                            // Add previous entity if exists
                            if (currentEntity.length() > 0) {
                                entities.add(currentEntity.toString().toLowerCase());
                                currentEntity.setLength(0);
                            }
                            currentEntity.append(word);
                        }
                    }
                }

                // Add last entity if any
                if (currentEntity.length() > 0) {
                    entities.add(currentEntity.toString().toLowerCase());
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return entities;
    }

    /**
     * Call the Gemini API to get suggestions for improving the resume.
     */
    private GeminiResumeSuggestion parseGeminiResponse(Map<String, Object> geminiResponse) {
        GeminiResumeSuggestion suggestion = new GeminiResumeSuggestion();

        try {
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) geminiResponse.get("candidates");
            if (candidates != null && !candidates.isEmpty()) {
                Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                List<Map<String, String>> parts = (List<Map<String, String>>) content.get("parts");

                if (parts != null && !parts.isEmpty()) {
                    String fullText = parts.get(0).get("text");

                    // Now extract specific parts
                    // (This is a simple parsing method, you can enhance using regex or NLP later)

                    String[] lines = fullText.split("\\n");
                    StringBuilder overall = new StringBuilder();
                    Map<String, String> sectionMap = new HashMap<>();

                    String currentSection = null;
                    StringBuilder currentText = new StringBuilder();

                    for (String line : lines) {
                        if (line.trim().startsWith("**") && line.trim().endsWith("**")) {
                            // save previous
                            if (currentSection != null && currentText.length() > 0) {
                                sectionMap.put(currentSection, currentText.toString().trim());
                                currentText.setLength(0);
                            }

                            // extract title
                            currentSection = line.replace("**", "").trim();
                        } else if (currentSection == null && !line.trim().isEmpty()) {
                            overall.append(line).append("\n");
                        } else {
                            currentText.append(line).append("\n");
                        }
                    }

                    // Add the last section
                    if (currentSection != null && currentText.length() > 0) {
                        sectionMap.put(currentSection, currentText.toString().trim());
                    }

                    suggestion.setOverallImpression(overall.toString().trim());
                    suggestion.setSectionSuggestions(sectionMap);
                }
            }
        } catch (Exception e) {
            e.printStackTrace(); // Replace with logger in production
        }

        return suggestion;
    }

    public GeminiAnalysisDTO callGeminiApi(String resumeContent, String jobDescription) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        String finalPrompt = geminiPromptTemplate
                .replace("{{RESUME_CONTENT}}", resumeContent)
                .replace("{{JOB_DESCRIPTION}}", jobDescription);

        String requestBody = """
                {
                  "contents": [{
                    "parts": [{
                      "text": "%s"
                    }]
                  }]
                }
                """.formatted(finalPrompt);

        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

        try {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + geminiApiKey;
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

            Map<String, Object> result = (Map<String, Object>) response.getBody();
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) result.get("candidates");

            if (!candidates.isEmpty()) {
                Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                List<Map<String, String>> parts = (List<Map<String, String>>) content.get("parts");
                String jsonString = parts.get(0).get("text");

             // Remove markdown-style code formatting if present
                jsonString = jsonString.replaceAll("(?s)^```json\\s*|\\s*```$", "").trim();

                ObjectMapper mapper = new ObjectMapper();
                return mapper.readValue(jsonString, GeminiAnalysisDTO.class);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    public void sendBookingEmail(BookingRequest booking) {
    // This method should implement the logic to send an email with the booking details.
        String subject = "Expert Session Scheduled for " + booking.name;
        String body = "Hi " + booking.name + ",\n\n" +
                "Your expert session has been scheduled.\n" +
                "📅 Date: " + booking.date + "\n" +
                "⏰ Time: " + booking.time + "\n" +
                "📞 Phone: " + booking.phone + "\n\n" +
                "Thank you for booking with us!\n";

        // Send to user
        SimpleMailMessage userMessage = new SimpleMailMessage();
        userMessage.setTo(booking.email);
        userMessage.setSubject("Your Expert Review Session is Confirmed!");
        userMessage.setText(body);
        mailSender.send(userMessage);

        // Send to admin
        SimpleMailMessage adminMessage = new SimpleMailMessage();
        adminMessage.setTo(adminEmail);
        adminMessage.setSubject(subject);
        adminMessage.setText(
                "New session booked by: " + booking.name + "\n" +
                        "📧 Email: " + booking.email + "\n" +
                        "📞 Phone: " + booking.phone + "\n" +
                        "📅 Date: " + booking.date + "\n" +
                        "⏰ Time: " + booking.time + "\n"
        );
        mailSender.send(adminMessage);
    }
}
