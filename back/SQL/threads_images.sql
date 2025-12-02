CREATE TABLE threads_images(
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    thread_uuid VARCHAR(36) NOT NULL,
    img_url VARCHAR(500) NOT NULL,
    position INT DEFAULT 0,
    commentaire VARCHAR(500),
    FOREIGN KEY (thread_uuid) REFERENCES threads(uuid) ON DELETE CASCADE
) ENGINE=InnoDB;