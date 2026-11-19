-- AddForeignKey
ALTER TABLE `ElectionResult` ADD CONSTRAINT `ElectionResult_positionId_fkey` FOREIGN KEY (`positionId`) REFERENCES `ElectionPosition`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ElectionResult` ADD CONSTRAINT `ElectionResult_candidateId_fkey` FOREIGN KEY (`candidateId`) REFERENCES `Candidate`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
