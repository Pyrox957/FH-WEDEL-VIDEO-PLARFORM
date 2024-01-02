const express = require('express');
const session = require('express-session');
const passport = require('passport');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

// Body-parser Middleware
app.use(bodyParser.urlencoded({ extended: true })); // Für form-encoded Bodies (z.B. von HTML-Formularen)
app.use(bodyParser.json()); // Für JSON Bodies


// Konfiguration der Express-Session
app.use(session({
    secret: 'meinGeheimesSecret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Auf 'true' setzen, wenn Ihre Seite über HTTPS läuft
}));

// Initialisierung von Passport und Session-Management
app.use(passport.initialize());
app.use(passport.session());
class Course {
    constructor(id, title, description, instructor, imageUrl, videoUrl) {
        this.id = id;           // Eindeutige Kurs-ID
        this.title = title;     // Titel des Kurses
        this.description = description; // Beschreibung des Kurses
        this.instructor = instructor;   // Name des Kursleiters
        this.imageUrl = imageUrl;       // URL zum Kursbild
        this.videoUrl = videoUrl;       // URL zu den Kursvideos (z.B. YouTube-Links)
    }
}
courses = [
    new Course(1, "Einführung in die Programmierung", "Lernen Sie die Grundlagen der Programmierung.", "Prof. Dr. Häuslein ", "imageUrl1.jpg", "https://www.youtube.com/watch?v=video1"),
    new Course(2, "Fortgeschrittene Webentwicklung", "Vertiefen Sie Ihr Wissen in der Webentwicklung.", "Prof. Dr. Marian Gadja", "imageUrl2.jpg", "https://www.youtube.com/watch?v=video2"),
    // Weitere Kurse...
];

class User {
    constructor(id, username, password, isAdmin) {
        this.id = id;
        this.username = username;
        this.password = password; // In einer realen Anwendung sollte das Passwort verschlüsselt gespeichert werden.
        this.isAdmin = isAdmin;
    }
}

let users = [
    new User(1, 'admin', 'pass123', true),
    new User(2, 'user', 'pass456', false)
    // Weitere Benutzer...
];

const LocalStrategy = require('passport-local').Strategy;



// Initialisierung von Passport und Session-Management
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
    (username, password, done) => {
      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    }
  ));
  
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    const user = users.find(u => u.id === id);
    done(null, user);
  });


// Statische Dateien
app.use(express.static(path.join(__dirname, 'public')));

// Templating-Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));



function isAuthenticated(req, res, next) {
    if (users.find(user => user.id == req.session.userId)) { // `req.isAuthenticated()` ist eine Methode, die von vielen Authentifizierungsbibliotheken bereitgestellt wird
        return next();
    }
    res.redirect('/login');
}
function isAdmin(req, res, next) {
    if ( users.find(user => user.id == req.session.userId).isAdmin) {
        return next();
    }
    res.status(403).send("Zugriff verweigert. Nur für Administratoren.");
}


// Startseite
app.get('/', (req, res) => {
    res.render('index', { courses: courses });
});


// Login-Seite
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        console.log(req.session.userId);
        req.session.userId = user.id; // Session mit Benutzer-ID erstellen
        console.log(req.session.userId);
        res.redirect('/courses'); // Weiterleitung nach erfolgreicher Anmeldung
    } else {
        res.status(401).send('Anmeldung fehlgeschlagen');
    }
});
app.post('/logout', (req, res) => {
    req.session.destroy(); // Session beenden
    res.redirect('/login');
});

// Kursübersichtsseite
app.get('/courses', isAuthenticated,(req, res) => {
    res.render('courses', { courses: courses });
});

// Kursseite (Beispiel für eine dynamische Route)
app.get('/course/:id', isAuthenticated,(req, res) => {
    const courseId = req.params.id;
    const course = courses.find(c => c.id == courseId);
    res.render('course', { course: course });
});

// Registrierungsseite
app.get('/register', (req, res) => {
    res.render('register');
});

// POST-Anfrage zur Benutzerregistrierung
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Überprüfen, ob der Benutzername bereits existiert
    const existingUser = users.find(user => user.username === username);

    if (existingUser) {
        return res.status(400).send('Benutzername bereits vergeben');
    }

    // Erzeugen Sie eine eindeutige Benutzer-ID (in einer echten Anwendung sollte dies sicherer sein)
    const newUserId = users.length + 1;

    // Erstellen Sie einen neuen Benutzer
    const newUser = new User(newUserId, username, password, false); // Standardmäßig ist isAdmin auf false

    // Fügen Sie den neuen Benutzer zur Benutzerliste hinzu
    users.push(newUser);

    // Nach erfolgreicher Registrierung können Sie den Benutzer weiterleiten.
    res.redirect('/login');
});





// admin seite, zum anlegen, bearbeiten und löschen von kursen
app.get('/admin',isAuthenticated && isAdmin, (req, res) => {
    res.render('admin');
});

// POST-Anfrage zum Hinzufügen eines neuen Kurses
app.post('/admin/add-course', isAuthenticated && isAdmin, (req, res) => {
    try {
        const { title, description, imageurl, videoUrl, instructor } = req.body;
        const newCourseId = courses.length + 1; // Beispiel für eine einfache ID-Generierung
        courses.push(new Course(newCourseId, title, description, instructor, imageurl, videoUrl));
        console.log(courses);
        res.redirect('/admin');
    } catch (error) {
        console.error(error); // Loggt den Fehler in der Konsole
        return res.status(500).send('Neuer Kurs konnte nicht angelegt werden.');
    }
});

// POST-Anfrage zum Löschen eines Kurses
app.post('/admin/delete-course/:id', isAuthenticated &&  isAdmin, (req, res) => {
    const courseId = parseInt(req.params.id); // ID aus URL-Parameter in eine Zahl umwandeln

    // Entfernen des Kurses aus der Liste
    courses = courses.filter(course => course.id !== courseId);

    // Weiterleitung zur Admin-Seite
    res.redirect('/admin');
});


// GET-Anfrage für die Kursbearbeitungsseite
app.get('/admin/edit-course/:id', isAuthenticated &&  isAdmin,(req, res) => {
    const courseId = req.params.id;
    const course = courses.find(c => c.id == courseId);

    if (!course) {
        return res.status(404).send('Kurs nicht gefunden');
    }

    res.render('edit-course', { course: course });
});

// POST-Anfrage zum Aktualisieren eines Kurses
app.post('/admin/update-course/:id', (req, res) => {
    const courseId = parseInt(req.params.id); // ID aus URL-Parameter
    const { title, description, imageUrl, videoUrl } = req.body; // Daten aus dem Formular

    // Finden des Kurses in der Liste
    const courseIndex = courses.findIndex(course => course.id === courseId);

    if (courseIndex !== -1) {
        // Aktualisieren des Kurses
        courses[courseIndex].title = title;
        courses[courseIndex].description = description;
        courses[courseIndex].imageUrl = imageUrl;
        courses[courseIndex].videoUrl = videoUrl;

        // Weiterleitung zur Admin-Seite
        res.redirect('/admin');
    } else {
        // Kurs nicht gefunden
        res.status(404).send('Kurs nicht gefunden');
    }
});

// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});

module.exports = app;
