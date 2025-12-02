CREATE TABLE threads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    news_uuid VARCHAR(36) NOT NULL,
    sous_titre VARCHAR(250) NOT NULL,
    description TEXT,
    FOREIGN KEY (news_uuid) REFERENCES news(uuid) ON DELETE CASCADE
) ENGINE=InnoDB;
