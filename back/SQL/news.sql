CREATE TABLE news(
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    titre VARCHAR(255) NOT NULL,
    img_url VARCHAR(500),
   category ENUM(
      'mobilier', 'bibelot', 'militaria', 'livre', 'numismatique',
      'tableau', 'carte-postale', 'divers'
    ),
    description TEXT
) ENGINE=InnoDB; 