/*
 * Upon submission, this file should contain the SQL script to initialize your database.
 * It should contain all DROP TABLE and CREATE TABLE statments, and any INSERT statements
 * required.
 */
 
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS likes;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS subscribles;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS icons;

CREATE TABLE icons (
	id INTEGER NOT NULL PRIMARY KEY,
	filename VARCHAR(32) NOT NULL
);

CREATE TABLE users (
	id INTEGER NOT NULL PRIMARY KEY,
	username VARCHAR(32) NOT NULL,
	fname VARCHAR(32) NOT NULL,
	mname VARCHAR(32),
	lname VARCHAR(32) NOT NULL,
	description VARCHAR(500) NOT NULL,
	date_of_birth TEXT NOT NULL,
	salt VARCHAR(64) NOT NULL,
	iterations INTEGER NOT NULL,
	hashed_password VARCHAR(512) NOT NULL,
	icon_id INTEGER NOT NULL,
	authToken VARCHAR(128),
	FOREIGN KEY (icon_id) REFERENCES icons (id)
);

CREATE TABLE subscribles (
	subscribed_id INTEGER NOT NULL,
	blogger_id INTEGER NOT NULL,
	PRIMARY KEY (subscribed_id, blogger_id),
	FOREIGN KEY (subscribed_id) REFERENCES users (id),
	FOREIGN KEY (blogger_id) REFERENCES users (id)
);

CREATE TABLE articles (
	id INTEGER NOT NULL PRIMARY KEY,
	title VARCHAR(32) NOT NULL,
	content VARCHAR(8000) NOT NULL,
	date_time TIMESTAMP NOT NULL,
	author_id INTEGER NOT NULL,
	FOREIGN KEY (author_id) REFERENCES users (id)
);

CREATE TABLE likes (
	user_id INTEGER NOT NULL,
	article_id INTEGER NOT NULL,
	PRIMARY KEY (user_id, article_id),
	FOREIGN KEY (user_id) REFERENCES users (id),
	FOREIGN KEY (article_id) REFERENCES articles (id)
);

CREATE TABLE comments (
	id INTEGER NOT NULL PRIMARY KEY,
	content VARCHAR(8000) NOT NULL,
	date_time TIMESTAMP NOT NULL,
	parent_id INTEGER,
	article_id INTEGER,
	user_id INTEGER NOT NULL,
	FOREIGN KEY (parent_id) REFERENCES comments (id),
	FOREIGN KEY (article_id) REFERENCES articles (id),
	FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE notifications (
	id INTEGER NOT NULL PRIMARY KEY,
	date_time TIMESTAMP NOT NULL,
	isRead BOOLEAN NOT NULL,
	message VARCHAR(500) NOT NULL,
	comment_id INTEGER,
	article_id INTEGER,
	user_id INTEGER NOT NULL,
	FOREIGN KEY (comment_id) REFERENCES comments (id),
	FOREIGN KEY (article_id) REFERENCES articles (id),
	FOREIGN KEY (user_id) REFERENCES users (id)
);

INSERT INTO icons (id, filename) VALUES 
	(1, 'wolf.png'),
	(2, 'orange_cat.png'),
	(3, 'meiduan.png'),
	(4, 'bear.png'),
	(5, 'hamster.png'),
	(6, 'fox.png'),
	(7, 'koala.png'),
	(8, 'dog.png'),
	(9, 'panda.png'),
	(10, 'cat.png');
	
INSERT INTO users (id, username, fname, mname, lname, description, date_of_birth, salt, iterations, hashed_password, icon_id) VALUES
	(1, 'bandalls', 'Robert', 'De', 'Niro', 'One of the greatest actors of all time, Robert De Niro was born on August 17, 1943 in Manhattan, New York City, to artists Virginia (Admiral) and Robert De Niro Sr.', '1943-08-17', '1', 9999, 'db6c8b5fefa69587f033b3ba64a7deeeaf536bd656b30057a95b03dbc8f7d3b778fe8584d18b331df355fb2d3154e93881a62124fd79d58103cc64d9c29bc5e11cb7455b3b0d4772bbdfb9eb595498c3f8275ac723fce0b8d0b06649910755e0e9bf1d59581ef842e8a6ec77de8d99e870a6def100154a9759318be8bfcff1c3451b18c7f286cdd92f2fad83842c6871e6104a4ac34d08744035a64595bc31f86956f1e52f91e3fd56bf233e60500f8f5e311af189a1f88a5f15be92a307bb9f177c539209fc3b9c7add5f3f7700c2285f334d7ebba3cbd62d6fddd7cc119deba49655fed92aea7344d35bdd6d1c2994960d9a82bd4d790b6cfde42457da2dd1', 2),
	(2, 'wattlexp','Jack', NULL, 'Nicholson', 'Jack Nicholson, an American actor, producer, director and screenwriter, is a three-time Academy Award winner and twelve-time nominee.', '1937-04-22', '2', 9999, 'ddf12e17e1775cf1e21e39135d42643f23e45132f3d161a8d39d82e5fca0339462718a0555e6bb5c6596e8b57565b937c95ea12276dbffbe1bb5d73d34487aaca12bfd5650f12471a063aa02ec17ca5e95795cba7dc601e9b115e18f4d7ac7a0e1b0459dd1cc25ce8639b89e038943e42b53b8535dd04afadeba047b97bfe28f1aa7750df0f48103e9ef715c6a1569bc1819ba025177d5d095c6815efac42c254ee5749e42651447c3bcb6463a55fb4069feafd7a9fc9284501188cc697562461f93831104ba8409fb0ca1758299b269560717f481fd35edffd2d228d5c810f423ab1061573f32571b8d8b8fa67514d73aaf8e5a043f7bd15ada18194b27a46f', 3),
	(3, 'sweetiele','Marlon', NULL, 'Brando', 'Marlon Brando is widely considered the greatest movie actor of all time, rivaled only by the more theatrically oriented Laurence Olivier in terms of esteem.', '1989-06-04', '3', 9999, '8b603053284bb4aac8e16102bdcbf3b02400015894776b7826b819a50a0a2cea7e1267b5a7a40de04de6915f5adb76a727727c34f4e9ef72f63313f48f6aae8c9316f812a396efeb4dc89fa550ae5ae9a686b4214ea0dc0840de18de2baa110d0dc84cface4ff9d11ce3452f51032f0994b04672ab25a8576afc4ff33e296787a2d4a7ac89b3e3971a6fdcf9f4e7d17f6e2bd8fedb340b1e0fbf027038e19944dd7554bc193b1e0c2f5d5ba173b89694004476eaa4de7227495f954e5ea627dbbc000776fa310ce07e5c8a954bc870b76e5f36fcbc63003e6ac392d435788c289ee57162b899d6b587375c463b8ab30c96df5143693fae0b9ddefb578afa76e2', 1),
	(4, 'hyperyaufarer','Denzel', NULL, 'Washington', 'Denzel Hayes Washington, Jr. was born on December 28, 1954 in Mount Vernon, New York. He is the middle of three children of a beautician mother, Lennis, from Georgia, and a Pentecostal minister father, Denzel Washington, Sr., from Virginia.', '1954-12-28', '4', 9999, 'a4686e16d43acef9d6efa7acdf2f1908ebdff1cf535406df26c73b01e4820db461a0ebe78036c1ebf5234d89db49d31e4e4de9abc4c141011d491f3e0da422a47b688338e2e5699c17244dc6b75afcab10182d0a07ce5e5d8b11829b4641ad7ebebbcf7534d6f097a0431eab990db1b6c4e7dd1df0ad7e42f84623cf73459d5ab4c87fceb3dee5afb30f4d34cf13cdf309c3507c5130e735386a00f3e113437e25e7c5fdb7e8b0b076fa3a7c4f8e75264bcc198e4896384277a0e464368c81c12f55d85fb8760ebe9fb37fbac187b0eeaa2dbe9ddd535484bd1d25f45983928af108385f4813f0163ce1664ef7552a7846faa37988828a610ee2c18876ae9bd9', 5),
	(5, 'editussion','Katharine', NULL, 'Hepburn', 'Katharine Houghton Hepburn was born on May 12, 1907 in Hartford, Connecticut to a suffragist, Katharine Martha (Houghton), and a doctor, Thomas Norval Hepburn, who both always encouraged her to speak her mind, develop it fully, and exercise her body to its full potential.', '1990-07-14', '5', 9999, '16888652bcdb679dcea854d53beb4dda24606dbbe6626951df87c178cb9d1a9826c90e6fea1f0fe6428abfca99dccc8bd88b69ddd6a656e8b19ab5598172a341bd19362a614bec5b6db991103e5a0fb04852c9b2819a25135c79d4f0b48df90f6acdf72a67ac3c9547161cbfd084c5aaa9ec58858bef78edfe48909809346762603c7851c8eb1458a20e25e1317d61dc3c46bee0c4972a27c1ce9679f1ecac494c7694667f1dbeba5efb2668e2325b27bcbafd40c1a14891de998a8481d5c08b83f1ced99388d932d091643e3657ae669e9142b13d7f8f94e71f485c366f329bc86e92471ab4207564f24be1875abf9f8c031fc66cffee3092f2c9b1e773fd75', 6),
	(6, 'experthead','Humphrey', NULL, 'Bogart', 'Humphrey DeForest Bogart was born in New York City, New York, to Maud Humphrey, a famed magazine illustrator and suffragette, and Belmont DeForest Bogart, a moderately wealthy surgeon (who was secretly addicted to opium).', '1995-12-04', '6', 9999, 'f5af7f83a58c64e2ae6c7584d0e207a0bb7e3902f3866ce972ff4aabcfe4d2d2f58085931e55c112fc833a363ff13a6e9c7f5a3871dcf7a30a899795437aa579f1025260573681eea5a604d870b6218638fc2855de0b86b683e135b3bc09308d785cb07af677225dcb9b50c213a62271a8368612a9ff28c14c61a801a9ba416fb7c0516e76cd95af61f820df59d57ba92076b6a3df7eeaeffed6a9489d4cbda58b47071a53bbca067b34e31e4d436132e0836de4eaf18e05ea1f10fd126b7c8ebb93af8ab47405093e83ae47565470991dd94ae3c3d6c150b2ddd32fafe94877f7fbbb66c18fe69b3e367c37ec43c28034ad299ff6fcc06e9dc252eb184c25a2', 4),
	(7, 'flamesbria','Meryl', NULL, 'Streep', 'Considered by many critics to be the greatest living actress, Meryl Streep has been nominated for the Academy Award an astonishing 21 times, and has won it three times.', '1985-08-23', '7', 9999, 'ccb6c1dd538a5663a3aee3a228b39534019141bf9ae6d419818be3aa3da2d476fdd5bb0e1177041864a824ebf42f6000a4635fa80a0d936c6b255c8f759159ed54cf6aaee6aef89efaba96c9d8781c88b6f1e978be51cca9be5547bc5f109c76bbf949ff891d41438ddd29fba3ab7c329adb90b7b5c99105977017b5606698a15b3de097a9e2c4f8ab1242183b1000666e8eae68b6874a53005d0f43e3bd3e63e5dbe90f26bd22bd2078fbb5152a1ea766ac4d3932ff006ca9aeadb1f484aa9b01127606c8fafa95a822f7a270cc8fc1f4a0ee0569d75451ab22375938ff8bf0e5db293caf2cdb7ea3c1f03884767caa2ce831f35c52d4d6a4d6897392c6413b', 7),
	(8, 'heroanhart','Daniel', 'Day', 'Lewis', 'Born in London, England, Daniel Michael Blake Day-Lewis is the second child of Cecil Day-Lewis (pseudonym Cecil Day-Lewis), Poet Laureate of the U.K., and his second wife, actress Jill Balcon.', '1988-11-12', '8', 9999, 'ab776be4eb243307f3665fea0f5d0dc11214db182305681dfdc61a3bb9677a1b5d74bae13b17f1f1cbaaf0dd38c5ed7f5693d55d3b0826b5d38658f31bb4dd27cb4b0cf7cbddc852ed273f83a745d75bccb612483f65ed230980362424941b3e1799d8edeb10de008360b989c0f30732dcd28c4e327ff6d87d99e446508268409b1fa298823dcb4214b02caa331d08cdca9c7a52bf4f8da06762169e46653c52f666e1ae93f6ea4f14adffcba6f9b692c6c367f5ef3c1f10508eb16161fb7869c91224ff69bf66c7c2c1bf6cf531fd70c27a5999e7e01f59d4f07d0f5ec87fc4d1747b2e84bfd063d765c652b6a8e8759688d4d0f1beac3233f437c6176779ef', 9),
	(9, 'liveltekah','Sidney', NULL, 'Poitier', 'Sidney Poitier was a native of Cat Island, Bahamas, although born, two months prematurely, in Miami during a visit by his parents, Evelyn (Outten) and Reginald James Poitier.', '1976-10-20', '9', 9999, 'c066add5e52fe7d45baff7b0c392da7d0453a66965f0e2bcc13431aef5f5afd524e61e498fda580b23e9fd735fda7abde0f92a996327e7c3417f8979f56a7b515d2f046e4edbd782f5990dddedf77111c2a5088e34451d63da54b1dff2d37667a8590a098a4108933331acb3f21e61b6da32fa51c6e9beda19f5a474fd1c4c6f5640dbc7d74cf4798ab3f517a5fe16b743d4fac53908304725be1a5c3b45c5696236dbf94f1336ca0cfae5ef901dd8b7dde6f3fae3c4e595cabaffc061029617d20cfae788a9cb3a30f194a26ece7b6cf73bcb10cfcfc64cd04f89ab3ad05fbf1b458be684f75944c0b56692c949b3597e0a1316a946e75714c3e093e623f925', 8),
	(10, 'linguss','Clark', NULL,'Gable', 'William Clark Gable was born on February 1, 1901 in Cadiz, Ohio, to Adeline (Hershelman) and William Henry Gable, an oil-well driller. He was of German, Irish, and Swiss-German descent.', '1991-05-12', '10', 9999, '6d6c85789cef74bad3ef943a9b367d21c339ed6135b7a532f8acd861fb6a3b4916fe919aba7a7af317909275d38ffb82279fba6cf275e64adc084e80bd5864758d422004a86bbda1e75895bae9e68b53cf242b3491d819d6891d8c9580b5e55d8a1a2a5c90fc498953e8c9ae464b82f77919e962dc28b9339ea7ae18ad09a1f70ccbd26dab6997b760d1b51c489f847c29b959602f6106d83980a3449e73d9cd9057eb5fa3b2eb147dae4a716172bcf40020abed9acf931ea8c3d02ab4cf6f9929f7f3cc1e133416bc4e456947756cdb4818dfefc25c45ab00f650512a4ccca2a0177fd2f46e9058a325f851bac56768b8ff56176ebf358da087f6061f4e1dee', 9);
	
INSERT INTO subscribles (subscribed_id, blogger_id) VALUES
	(2, 1),
	(3, 1),
	(4, 1),
	(1, 2),
	(1, 3),
	(2, 5),
	(2, 7),
	(8, 3),
	(8, 9),
	(8, 10),
	(9, 8),
	(9, 10),
	(10, 5),
	(10, 7);
	
INSERT INTO articles (id, title, content, date_time, author_id) VALUES
	(1, 'Pokem ipsum dolor sit amet Budew Togetic Seviper Swellow Regirock Marsh Badge. Leaf Green Electrike Swinub Escavalier Durant Kakuna Servine. Volcano Badge Lumineon Raikou Baltoy Vullaby Chatot Tornadus. Vermilion City searching far and wide Elite Four Oddish Cleffa Snover Swinub. Lavender Town Zebstrika Yamask Psyduck Dome Fossil Watchog Dragon Rage.', 'If MOVIE Is So Terrible, Why Do not Statistics Show It?', datetime('2019-10-15 15:48:10'), 1),
	(2, 'Duis aute irure dolor in reprehenderit in voluptate Glalie Bayleef Tornadus Kingdra Fire Glitch City. Sed do eiusmod tempor incididunt Hitmonchan Clamperl Torkoal Rock Zubat Grass. Sapphire Electrode et dolore magna aliqua Leavanny Munchlax Cerulean City Glitch City. Mirror Move Corsola Litwick Persian Maractus Rhyperior Cacturne. Boulder Badge Caterpie Chimchar Minun Spinarak Uxie Slakoth.', '10 Tips That Will Make You Influential In MOVIE', datetime('2020-04-16 19:28:40'), 1),
	(3, 'Dark Typhlosion sunt in culpa qui officia Vanillite Beldum Jynx ullamco laboris nisi. Ivysaur Gothitelle Dusclops Espeon Simisear Oshawott Lopunny. Ground Fighting Entei Zigzagoon Rhydon Salamence Venomoth. Dark Sentret Pokemon, it is you and me Slowking Ninetales Klinklang Koffing. Vermilion City Togetic Buneary lorem ipsum dolor sit amet Lileep Elekid Hitmonchan.', 'How To Teach MOVIE Better Than Anyone Else', datetime('2021-12-16 10:28:45'), 1),
	(4, 'Celadon Department Store Abomasnow Plain Badge Staraptor Camerupt Swadloon Johto. Fog Badge Zapdos Seviper Shaymin Petilil Lairon Sewaddle. Vine Whip Shuckle Simipour Gallade Mew Slash Earthquake. Earthquake Grotle Rufflet Vulpix Mineral Badge Lickitung Darmanitan. Team Rocket Foongus Illumise Gliscor Abra Misty our courage will pull us through.', 'Believe In Your MOVIE Skills But Never Stop Improving', datetime('2022-04-08 09:58:59'), 2),
	(5, 'Ghost ex ea commodo consequat Krabby Gulpin Medicham Marsh Badge Tyrogue. Flying Deerling Magcargo Sentret Drapion Victini Beedrill. Cerulean City Pokemon 4Ever Chingling Monferno Mismagius Altaria Houndoom. Leaf Green Charizard Hydreigon Blue Omastar Zephyr Badge Registeel. Pikachu Rhyperior Misty Darmanitan Red Shinx Torchic.', '5 Ways MOVIE Will Help You Get More Business', datetime('2022-06-19 19:38:59'), 3),
	(6, 'Pokem ipsum dolor sit amet Giratina Venonat Duosion Ultra Ball Pidgeot Meowth. Misty Gurdurr Ludicolo Medicham Officer Jenny Honchkrow Feebas. Fire Ice Berry Hitmonlee Togepi Wooper Rapidash Cubchoo. Venusaur Nidoking Drilbur Skuntank Normal Kanto Simisage. Sonic Boom Petilil Cacnea Skorupi Yanmega Gurdurr Dialga.', 'Double Your Profit With These 5 Tips on MOVIE', datetime('2023-02-21 23:38:03'), 5),
	(7, 'Hydro Pump Leech Life Pikachu Fire Red Cacnea Golduck Super Potion. Sonic Boom Chimchar Oddish Togepi Pokemon Fan Club Chairman Tangrowth Ash Ketchum. Charmeleon Starly Soda Pop to denounce the evils of truth and love Articuno Cacturne to protect the world from devastation. Sand-Attack Quilava Vileplume Vileplume Glacier Badge Wailord Jellicent. Celadon City Rayquaza incididunt ut labore Petilil Gothitelle Wurmple Burmy.', 'The MOVIE Mystery Revealed', datetime('2023-01-02 20:38:43'), 7),
	(8, 'Meowth, that is right Ash is mother Glitch City Scyther Chatot Camerupt you are not wearing shorts. Celadon City Kakuna Braviary Jumpluff Electrode Flaaffy Rotom. Sed do eiusmod tempor incididunt Trapinch Seedot we are blasting off again Rampardos Tynamo Snover. Soul Badge Rage Gary Woobat Minccino Ampharos Gengar. Fog Badge Regice Ash Luvdisc Torkoal Chinchou Throh.', 'You Will Thank Us - 10 Tips About MOVIE You Need To Know', datetime('2023-01-13 05:36:43'), 8),
	(9, 'Kanto Kyurem Magcargo Buneary Exeggutor Growlithe Ferroseed. Fuchsia City S.S. Anne Spiritomb Frillish Farfetchd Luvdisc Pansage. Thunder Badge the enemy Pokemon fainted Sharpedo Gurdurr Weedle Misty Sceptile. Kanto Ariados Caterpie Mirror Move Blaziken Rock Dialga. Hydro Pump to train them is my cause Hippowdon Wailord Marsh Badge Magby Psychic.', 'Sick And Tired Of Doing MOVIE The Old Way? Read This', datetime('2023-03-25 15:39:43'), 10),
	(10, 'Pallet Town Natu Johto Samurott Typhlosion Oshawott Karrablast. Sinnoh Pinsir Tyrogue Frillish Escape Rope Donphan Claydol. Velit esse cillum dolore eu fugiat nulla pariatur Ninjask Psyduck Butterfree Crawdaunt in voluptate velit esse cillum dolore eu fugiat nulla pariatur Kecleon. Pokemon Heroes Manectric Carracosta Azelf Treecko Kyurem Garchomp. Ut labore et dolore magna aliqua Leaf Green Cherrim Pidgeot Azumarill Maractus Burnt Berry.', 'Here Is What You Should Do For Your MOVIE', datetime('2023-05-18 17:51:38'), 10);
	
INSERT INTO likes (user_id, article_id) VALUES
	(2, 1),
	(3, 1),
	(4, 1),
	(2, 2),
	(3, 2),
	(4, 2),
	(2, 3),
	(3, 3),
	(4, 3),
	(4, 5),
	(5, 6),
	(6, 4),
	(8, 5),
	(7, 10),
	(5, 8),
	(9, 6),
	(10, 10),
	(4, 9),
	(5, 7),
	(10, 6);
	
INSERT INTO comments (id, content, date_time, parent_id, article_id, user_id) VALUES
	(1, 'Pokem ipsum dolor sit amet Maractus Ralts Slakoth Machop Registeel Rhydon. Kanto Kabuto Ash Ketchum Rotom Hoothoot Shellos Mantyke. Sonic Boom Jellicent Mamoswine Kangaskhan Thunder Badge Cradily Poison. Fire Vanillish Hoenn Espeon Pewter City Garchomp Blitzle. Wing Attack Ampharos ut enim ad minim veniam but nothing happened Azumarill Gothitelle Minccino.', datetime('now'), NULL, 1, 2),
	(2, 'Bug Cacturne Slakoth Omastar Pinsir Trubbish Purugly. Normal Tympole Wooper gotta catch em all Vanillite Tentacruel Feraligatr. Leech Life Jynx Reuniclus Nidorino Pokemon 4Ever Mineral Badge Maractus. Teleport Skiploom Scizor Soda Pop Mewtwo Strikes Back Hypno Shedinja. Fighting Bronzong Riolu Missingno Archen Rare Candy Lotad.', datetime('now'), NULL, 1, 3),
	(3, 'Good job~', datetime('now'), 1, NULL, 4),
	(4, 'Excellent!', datetime('now'), 3, NULL, 2),
	(5, 'Hive Badge Murkrow Roserade Banette Entei Grumpig Serperior. Blue Sealeo Tyrogue Nidoqueen Garbodor Aron Rising Badge. Mewtwo Strikes Back Munchlax Kingler Larvitar Ash Ketchum Blizzard Meganium. Zephyr Badge in voluptate velit esse cillum dolore eu fugiat nulla pariatur Lavender Town Kricketune Smeargle Plusle Cubone. Leech Life Blissey Abomasnow surrender now or prepare to fight Glaceon Relicanth Vanillite.', datetime('now'), NULL, 2, 4),
	(6, 'Fire Bibarel Flygon Skarmory Accelgor Golurk Empoleon. Gold Crawdaunt Vulpix Servine Gible Bulbasaur Abomasnow. Body Slam Vine Whip Nidoqueen Vulpix Professor Oak Golbat Graveler. Flamethrower Vulpix Aron Zweilous Delibird Lileep Porygon. Body Slam Zapdos Poliwrath Piloswine Rhyhorn Blitzle Togetic.', datetime('now'), NULL, 3, 5),
	(7, 'Thundershock Ho-oh Grimer Walrein Wartortle I wanna be the very best Trapinch. Pokemon Heroes Vaporeon Dragonair Espeon Beartic Kyurem Mienshao. Poison Koffing Nidoran Drapion Spearow gotta catch them all Wormadam. Meowth, that is right Kingler Steelix Growlithe Dragonite Herdier Vine Whip. Charmander Cresselia Mint Berry Ducklett Spoink Dragonair Swalot.', datetime('now'),NULL, 4, 8),
	(8, 'I cannot agree more~~', datetime('now'), 5, NULL, 10),
	(9, 'Yes, you are right!', datetime('now'), 6, NULL, 9),
	(10, 'Make America great again!', datetime('now'), 7, NULL, 7),
	(11, 'Pokem ipsum dolor sit amet Magby Dragon Rage Vanillish Sneasel Pidgey Lairon. Earth Badge Houndoom Gible Chimecho Simisear Heatmor Pelipper. Misty Minun Gastrodon Celadon Department Store S.S. Anne Shiftry Heracross. Pokemon 4Ever to catch them is my real test Fire Missingno Nuzleaf Gorebyss Red. Normal Arceus Gary Rotom Houndoom Murkrow in a world we must defend.', datetime('now'), NULL, 5, 3),
	(12, 'We are blasting off again Zorua Mandibuzz Woobat Piloswine Junichi Masuda Pichu. Thunder Badge Kecleon Mystery Gift Palkia Leech Life Glameow Delibird. Silver Pokemon, it is you and me bicycle Natu Scraggy Meowth Bidoof. Volcano Badge Sapphire Patrat Golduck incididunt ut labore gym Lunatone. Pokemon 4Ever Metagross Archen Muk Yanmega Lairon Loudred.', datetime('now'), NULL, 6, 10),
	(13, 'Sed do eiusmod tempor incididunt Eevee Venipede Mareep Keldeo you are not wearing shorts Relicanth. Pokemon Luxray Tirtouga Harden Larvitar Snubbull Makuhita. Poison Sting Rotom Mamoswine you are not wearing shorts Rage Bidoof Horsea. Lorem ipsum dolor sit amet Marill Rotom Dark Cyndaquil I like shorts lorem ipsum dolor sit amet. Blastoise Metagross Kabuto Smeargle Lillipup Manaphy Pallet Town.', datetime('now'), NULL, 7, 8),
	(14, 'Hoenn Buneary Poke Flute Pidgeotto Helix Fossil Mantine Hoothoot. Soul Badge to protect the world from devastation like no one ever was Rayquaza Purrloin to extend our reach to the stars above Blizzard. Vine Whip Torterra Mawile searching far and wide Donphan Medicham Feraligatr. Earthquake Vulpix Missingno Misty Larvitar Palkia Brock. Hive Badge Lunatone Carvanha Azelf Onix Trubbish Clamperl.', datetime('now'), NULL, 8, 6),
	(15, 'Fog Badge Shuppet Dusknoir Ho-oh Darumaka Ekans Hippowdon. Dragon Junichi Masuda Electric Viridian City Espeon Bubble Soul Badge. Poison Sting Roselia Minccino Masquerain Whirlipede Leech Life Shellos. Ghost Phanpy sunt in culpa qui officia Pokemon Lavender Town Leech Life Beldum. Teleport Dustox Latias Burnt Berry Anorith Sharpedo Ground.', datetime('now'), NULL, 9, 5),
	(16, 'Pokem ipsum dolor sit amet Rotom Cherrim Boulder Badge Shellos Mismagius in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Celadon Department Store Rhyhorn consectetur adipisicing elit Whirlipede Marsh Badge Glalie Crustle. Rising Badge Drowzee Delcatty Turtwig Pansage Pokemon Clefairy. Bubble Darkrai Delibird Seedot James Ho-oh Manaphy. Charizard Rampardos gotta catch them all Slakoth Missingno Starly Victini.', datetime('now'), NULL, 10, 10);
	
INSERT  INTO notifications VALUES
	(1, datetime('now'), false, 'XX creates a new article.', NULL, 1, 2),
	(2, datetime('now'), false, 'XX makes to a comment.', 1, NULL, 1),
	(3, datetime('now'), false, 'A news subscriber starts following you.', NULL, NULL, 3),
	(4, datetime('now'), false, 'XX replies to a comment.', 10, NULL, 10),
	(5, datetime('now'), false, 'XX creates a new article.', NULL, 6, 10),
	(6, datetime('now'), false, 'XX creates a new article.', NULL, 8, 9),
	(7, datetime('now'), false, 'XX makes to a comment.', 15, NULL, 2),
	(8, datetime('now'), false, 'XX replies to a comment.', 9, NULL, 8),
	(9, datetime('now'), false, 'A news subscriber starts following you.', NULL, NULL, 7),
	(10, datetime('now'), false, 'A news subscriber starts following you.', NULL, NULL, 1);
	
	