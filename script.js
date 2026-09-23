const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const slots = ["9-10", "10-11", "11:15-12:15", "12:15-1:15", "2-3", "3-4"];

let C = [];
let E = [];

function add() {
    let subject = s.value.trim();
    let teacher = t.value.trim();
    let room = r.value.trim();

    if (!subject || !teacher || !room) {
        return alert("Fill all fields");
    }

    C.push({
        id: C.length,
        subject,
        teacher,
        room
    });

    s.value = t.value = r.value = "";
    refresh();
}

function conflict() {
    let x = +a.value;
    let y = +b.value;

    if (x === y || isNaN(x) || isNaN(y)) {
        return alert("Choose two different subjects");
    }

    if (!E.some(e =>
        (e[0] === x && e[1] === y) ||
        (e[0] === y && e[1] === x)
    )) {
        E.push([x, y]);
    }

    refresh();
}

function refresh() {
    list.innerHTML = C
        .map(x =>
            '<div class="item"><b>' +
            x.subject +
            '</b> — ' +
            x.teacher +
            ' — ' +
            x.room +
            '</div>'
        )
        .join("");

    let o = C
        .map(x =>
            '<option value="' +
            x.id +
            '">' +
            x.subject +
            '</option>'
        )
        .join("");

    a.innerHTML = b.innerHTML = o;

    cl.innerHTML = E
        .map(e =>
            '<div class="item">' +
            C[e[0]].subject +
            ' ↔ ' +
            C[e[1]].subject +
            '</div>'
        )
        .join("");
}

function graph() {
    let g = C.map(() => new Set());

    for (let i = 0; i < C.length; i++) {
        for (let j = i + 1; j < C.length; j++) {
            if (
                C[i].teacher.toLowerCase() === C[j].teacher.toLowerCase() ||
                C[i].room.toLowerCase() === C[j].room.toLowerCase()
            ) {
                g[i].add(j);
                g[j].add(i);
            }
        }
    }

    E.forEach(e => {
        g[e[0]].add(e[1]);
        g[e[1]].add(e[0]);
    });

    return g;
}

function color(g) {
    let order = C
        .map((_, i) => i)
        .sort((x, y) => g[y].size - g[x].size);

    let col = Array(C.length).fill(-1);

    for (let v of order) {
        let used = new Set(
            [...g[v]].map(x => col[x])
        );

        let c = 0;

        while (used.has(c)) {
            c++;
        }

        col[v] = c;
    }

    return col;
}

function generate() {
    if (!C.length) {
        return alert("Add classes first");
    }

    let col = color(graph());

    let A = C.map((x, i) => ({
        ...x,
        c: col[i]
    }));

    let h =
        "<p><b>Generated using greedy graph coloring.</b></p>" +
        "<table class='table'><tr><th>Day</th>" +
        slots.map(x => "<th>" + x + "</th>").join("") +
        "</tr>";

    days.forEach((d, di) => {
        h += "<tr><th>" + d + "</th>";

        for (let si = 0; si < slots.length; si++) {
            let z = A.filter(
                x => x.c === di * slots.length + si
            );

            h +=
                "<td>" +
                z.map(x =>
                    "<div class='box'><b>" +
                    x.subject +
                    "</b><br>" +
                    x.teacher +
                    "<br>" +
                    x.room +
                    "</div>"
                ).join("") +
                " </td>";
        }

        h += "</tr>";
    });

    out.innerHTML = h + "</table>";
}

function demo() {
    C = [
        {
            id: 0,
            subject: "DBMS",
            teacher: "Arun",
            room: "A101"
        },
        {
            id: 1,
            subject: "OS",
            teacher: "Bala",
            room: "A102"
        },
        {
            id: 2,
            subject: "CN",
            teacher: "Arun",
            room: "A103"
        },
        {
            id: 3,
            subject: "DSA",
            teacher: "Divya",
            room: "A101"
        },
        {
            id: 4,
            subject: "TOC",
            teacher: "Kumar",
            room: "A104"
        },
        {
            id: 5,
            subject: "AI",
            teacher: "Meena",
            room: "A105"
        }
    ];

    E = [
        [0, 1],
        [1, 2],
        [2, 4],
        [3, 5]
    ];

    refresh();
}

refresh();
