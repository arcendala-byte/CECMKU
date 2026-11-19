CREATE TABLE `CandidateRegistration` (
    `id` VARCHAR(191) NOT NULL,
    `reference` VARCHAR(191) NOT NULL,
    `cycleKey` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `registrationNo` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `faculty` VARCHAR(191) NOT NULL,
    `department` VARCHAR(191) NOT NULL,
    `course` VARCHAR(191) NOT NULL,
    `yearOfStudy` VARCHAR(191) NOT NULL,
    `intendedPosition` VARCHAR(191) NOT NULL,
    `biography` TEXT NOT NULL,
    `manifesto` TEXT NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `candidateId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `CandidateRegistration_reference_key`(`reference`),
    UNIQUE INDEX `CandidateRegistration_registrationNo_cycleKey_key`(`registrationNo`, `cycleKey`),
    INDEX `CandidateRegistration_status_createdAt_idx`(`status`, `createdAt`),
    INDEX `CandidateRegistration_fullName_idx`(`fullName`),
    INDEX `CandidateRegistration_email_idx`(`email`),
    INDEX `CandidateRegistration_candidateId_idx`(`candidateId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `CandidateRegistrationFile` (
    `id` VARCHAR(191) NOT NULL,
    `registrationId` VARCHAR(191) NOT NULL,
    `type` ENUM('PROFILE_PHOTO', 'SUPPORTING_DOCUMENT') NOT NULL,
    `originalName` VARCHAR(191) NOT NULL,
    `storedName` VARCHAR(191) NOT NULL,
    `mimeType` VARCHAR(191) NOT NULL,
    `size` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `CandidateRegistrationFile_storedName_key`(`storedName`),
    INDEX `CandidateRegistrationFile_registrationId_type_idx`(`registrationId`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `CandidateRegistration`
    ADD CONSTRAINT `CandidateRegistration_candidateId_fkey`
    FOREIGN KEY (`candidateId`) REFERENCES `Candidate`(`id`)
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `CandidateRegistrationFile`
    ADD CONSTRAINT `CandidateRegistrationFile_registrationId_fkey`
    FOREIGN KEY (`registrationId`) REFERENCES `CandidateRegistration`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;
