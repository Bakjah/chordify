package com.chordify.repository;

import com.chordify.model.VerificationRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VerificationRequestRepository extends JpaRepository<VerificationRequest, Long> {
}
