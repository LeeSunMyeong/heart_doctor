package com.example.heart_disease;

import ac.cbnu.heartcheck.HeartDiseaseApplication;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(classes = HeartDiseaseApplication.class)
@ActiveProfiles("test")
class HeartDiseaseApplicationTests {

	@Test
	void contextLoads() {
	}

}
