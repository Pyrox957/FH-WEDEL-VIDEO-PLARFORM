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
        this.description = description; // Beschreibung des Kursespython
        this.instructor = instructor;   // Name des Kursleiters
        this.imageUrl = imageUrl;       // URL zum Kursbild
        this.videoUrl = videoUrl;       // URL zu den Kursvideos (z.B. YouTube-Links)
    }
}
courses = [
    new Course(1, "Einführung in die Programmierung", "Lernen Sie die Grundlagen der Programmierung.", "Prof. Dr. Häuslein ", "https://codeop.tech/wp-content/uploads/2021/11/artturi-jalli-g5_rxRjvKmg-unsplash-scaled.jpg", "https://www.youtube.com/watch?v=DiidEp6DqCo&list=PLNmsVeXQZj7q0ao69AIogD94oBgp3E9Zs&ab_channel=TheMorpheusTutorials"),
    new Course(2, "Fortgeschrittene Webentwicklung", "Vertiefen Sie Ihr Wissen in der Webentwicklung.", "Prof. Dr. Marian Gadja", "data:image/png;base64,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", "https://www.youtube.com/watch?v=video2"),
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
