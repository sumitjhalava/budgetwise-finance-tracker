package com.budgetwise.service;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.Locale;

@Service
public class AutoCategoryService {

    private static final Map<String, List<String>> CATEGORY_KEYWORDS = new HashMap<>();

    static {
        CATEGORY_KEYWORDS.put("Food & Dining", Arrays.asList(
            "pizza", "burger", "restaurant", "dominos", "mcdonalds", "kfc", "food", "cafe", "coffee", 
            "starbucks", "subway", "dining", "lunch", "dinner", "breakfast", "snacks", "bakery"
        ));
        
        CATEGORY_KEYWORDS.put("Shopping", Arrays.asList(
            "shirt", "clothes", "zara", "h&m", "shopping", "mall", "amazon", "flipkart", "shoes", 
            "dress", "jeans", "electronics", "mobile", "laptop", "book", "gift"
        ));
        
        CATEGORY_KEYWORDS.put("Transport", Arrays.asList(
            "uber", "petrol", "fuel", "bus", "taxi", "ola", "metro", "train", "flight", "parking", 
            "toll", "auto", "rickshaw", "bike", "car"
        ));
        
        CATEGORY_KEYWORDS.put("Health", Arrays.asList(
            "hospital", "medicines", "doctor", "pharmacy", "medical", "clinic", "health", "medicine", 
            "pills", "treatment", "checkup", "dentist"
        ));
        
        CATEGORY_KEYWORDS.put("Bills & Utilities", Arrays.asList(
            "recharge", "wifi", "bill", "electricity", "water", "gas", "internet", "mobile", "phone", 
            "utility", "rent", "maintenance", "insurance"
        ));
        
        CATEGORY_KEYWORDS.put("Entertainment", Arrays.asList(
            "movie", "cinema", "netflix", "spotify", "game", "concert", "party", "club", "bar", 
            "entertainment", "music", "youtube"
        ));
        
        CATEGORY_KEYWORDS.put("Education", Arrays.asList(
            "school", "college", "course", "book", "education", "tuition", "fees", "training", 
            "certification", "exam"
        ));
        
        CATEGORY_KEYWORDS.put("Travel", Arrays.asList(
            "hotel", "booking", "vacation", "trip", "travel", "flight", "train", "bus", "tour", 
            "holiday", "resort"
        ));
    }

    public String predictCategory(String description) {
        if (description == null || description.isBlank()) {
            return "Other";
        }

        String lowerDescription = description.toLowerCase(Locale.ROOT);
        
        for (Map.Entry<String, List<String>> entry : CATEGORY_KEYWORDS.entrySet()) {
            String category = entry.getKey();
            List<String> keywords = entry.getValue();
            
            for (String keyword : keywords) {
                if (lowerDescription.indexOf(keyword.toLowerCase(Locale.ROOT)) >= 0) {
                    return category;
                }
            }
        }
        
        return "Other";
    }


}