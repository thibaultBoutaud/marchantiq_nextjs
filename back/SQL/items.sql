CREATE TABLE items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    name VARCHAR(250) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    artist VARCHAR(250),
    state VARCHAR(250) ,
    matiere VARCHAR(250),
    longeur VARCHAR(250),
    largeur VARCHAR(250),
    hauteur VARCHAR(250),
    diam VARCHAR(250),
    profondeur VARCHAR(250),
    style VARCHAR(250),
    epoque VARCHAR(250),
    year VARCHAR(250),
    category ENUM(
      'mobilier', 'bibelot', 'militaria', 'livre', 'numismatique',
      'tableau', 'carte-postale', 'divers'
    ),
    description TEXT,
    isNew BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
