<?php

namespace App\DataFixtures;

use App\Factory\FolderFactory;
use App\Factory\SnippetFactory;
use App\Factory\UserFactory;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

final class AppFixtures extends Fixture
{
    // 20 langages, 20 vrais snippets : de la matière réaliste pour la coloration shiki.
    // Nowdoc (<<<'CODE') partout : pas d'interpolation PHP, le code est stocké tel quel.
    private const DEMO_SNIPPETS = [
        [
            'language' => 'php',
            'title' => 'Slugifier une chaîne',
            'description' => 'Transforme un titre en slug URL-safe.',
            'code' => <<<'CODE'
function slugify(string $text): string
{
    $text = transliterator_transliterate('Any-Latin; Latin-ASCII; Lower()', $text);

    return trim(preg_replace('/[^a-z0-9]+/', '-', $text), '-');
}
CODE,
        ],
        [
            'language' => 'typescript',
            'title' => 'Debounce typé',
            'description' => 'Retarde un appel tant que l’utilisateur tape.',
            'code' => <<<'CODE'
function debounce<T extends (...args: any[]) => void>(fn: T, delay = 300) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
CODE,
        ],
        [
            'language' => 'python',
            'title' => 'Lecture de CSV en dataclasses',
            'description' => null,
            'code' => <<<'CODE'
from dataclasses import dataclass
import csv

@dataclass
class Row:
    name: str
    price: float

def load(path: str) -> list[Row]:
    with open(path, newline="") as f:
        return [Row(r["name"], float(r["price"])) for r in csv.DictReader(f)]
CODE,
        ],
        [
            'language' => 'sql',
            'title' => 'Top 5 des clients par CA',
            'description' => 'Window function pour classer sans sous-requête.',
            'code' => <<<'CODE'
SELECT customer_id,
       SUM(amount)                                   AS revenue,
       RANK() OVER (ORDER BY SUM(amount) DESC)       AS position
FROM orders
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY customer_id
ORDER BY revenue DESC
LIMIT 5;
CODE,
        ],
        [
            'language' => 'twig',
            'title' => 'Liste avec état vide',
            'description' => 'Le pattern for/else de Twig.',
            'code' => <<<'CODE'
<ul class="snippets">
    {% for snippet in snippets %}
        <li>{{ snippet.title }} — {{ snippet.language|upper }}</li>
    {% else %}
        <li class="empty">Aucun snippet pour l’instant.</li>
    {% endfor %}
</ul>
CODE,
        ],
        [
            'language' => 'javascript',
            'title' => 'Grouper un tableau par clé',
            'description' => null,
            'code' => <<<'CODE'
const groupBy = (items, key) =>
  items.reduce((acc, item) => {
    (acc[item[key]] ??= []).push(item);
    return acc;
  }, {});

groupBy(snippets, "language");
CODE,
        ],
        [
            'language' => 'go',
            'title' => 'Worker pool minimal',
            'description' => 'Fan-out sur un channel, très idiomatique.',
            'code' => <<<'CODE'
func process(jobs <-chan string, results chan<- string) {
	for j := range jobs {
		results <- strings.ToUpper(j)
	}
}

func main() {
	jobs, results := make(chan string, 10), make(chan string, 10)
	for range 3 {
		go process(jobs, results)
	}
}
CODE,
        ],
        [
            'language' => 'ruby',
            'title' => 'Memoization paresseuse',
            'description' => null,
            'code' => <<<'CODE'
class Report
  def heavy_stats
    @heavy_stats ||= orders.group_by(&:status)
                           .transform_values { |o| o.sum(&:amount) }
  end
end
CODE,
        ],
        [
            'language' => 'rust',
            'title' => 'Parsing robuste avec Result',
            'description' => 'Pas d’exception : l’erreur fait partie du type.',
            'code' => <<<'CODE'
fn parse_port(input: &str) -> Result<u16, String> {
    input
        .trim()
        .parse::<u16>()
        .map_err(|e| format!("port invalide « {input} » : {e}"))
}

fn main() {
    match parse_port("8080") {
        Ok(port) => println!("écoute sur :{port}"),
        Err(msg) => eprintln!("{msg}"),
    }
}
CODE,
        ],
        [
            'language' => 'bash',
            'title' => 'Backup avec rotation',
            'description' => 'Garde les 7 derniers dumps, supprime le reste.',
            'code' => <<<'CODE'
#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR=/var/backups/app
pg_dump app_db | gzip > "$BACKUP_DIR/dump-$(date +%F).sql.gz"
ls -1t "$BACKUP_DIR"/dump-*.sql.gz | tail -n +8 | xargs -r rm --
CODE,
        ],
    ];

    private const OTHER_SNIPPETS = [
        [
            'language' => 'java',
            'title' => 'Stream : moyenne par groupe',
            'description' => null,
            'code' => <<<'CODE'
Map<String, Double> avgByCity = people.stream()
    .collect(Collectors.groupingBy(
        Person::city,
        Collectors.averagingInt(Person::age)
    ));
CODE,
        ],
        [
            'language' => 'csharp',
            'title' => 'Record + pattern matching',
            'description' => null,
            'code' => <<<'CODE'
public record Shape;
public record Circle(double Radius) : Shape;
public record Rect(double W, double H) : Shape;

static double Area(Shape s) => s switch
{
    Circle c => Math.PI * c.Radius * c.Radius,
    Rect r   => r.W * r.H,
    _        => 0,
};
CODE,
        ],
        [
            'language' => 'kotlin',
            'title' => 'Extension function sur String',
            'description' => 'Tronque proprement sans couper un mot.',
            'code' => <<<'CODE'
fun String.ellipsize(max: Int): String =
    if (length <= max) this
    else take(max).substringBeforeLast(' ') + "…"

println("Le pattern matching change tout".ellipsize(20))
CODE,
        ],
        [
            'language' => 'swift',
            'title' => 'Codable en une struct',
            'description' => null,
            'code' => <<<'CODE'
struct Snippet: Codable {
    let id: Int
    let title: String
    let language: String?
}

let snippets = try JSONDecoder().decode([Snippet].self, from: data)
CODE,
        ],
        [
            'language' => 'c',
            'title' => 'Swap sans variable temporaire',
            'description' => 'Le classique XOR — à ne jamais faire en vrai.',
            'code' => <<<'CODE'
void swap(int *a, int *b)
{
    if (a != b) {
        *a ^= *b;
        *b ^= *a;
        *a ^= *b;
    }
}
CODE,
        ],
        [
            'language' => 'cpp',
            'title' => 'RAII : lock automatique',
            'description' => null,
            'code' => <<<'CODE'
#include <mutex>

std::mutex m;
int counter = 0;

void increment()
{
    std::lock_guard<std::mutex> guard(m); // libéré en fin de scope
    ++counter;
}
CODE,
        ],
        [
            'language' => 'css',
            'title' => 'Grille responsive sans media query',
            'description' => 'auto-fit + minmax font tout le travail.',
            'code' => <<<'CODE'
.cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
    gap: 1rem;
}

.cards > article {
    container-type: inline-size;
}
CODE,
        ],
        [
            'language' => 'html',
            'title' => 'Dialog natif',
            'description' => 'Une modale accessible sans une ligne de JS de lib.',
            'code' => <<<'CODE'
<dialog id="confirm">
    <form method="dialog">
        <p>Supprimer ce snippet ?</p>
        <button value="cancel">Annuler</button>
        <button value="ok" autofocus>Supprimer</button>
    </form>
</dialog>
<button onclick="confirm.showModal()">Supprimer</button>
CODE,
        ],
        [
            'language' => 'json',
            'title' => 'Config ESLint flat',
            'description' => null,
            'code' => <<<'CODE'
{
    "name": "chillbox-front",
    "type": "module",
    "scripts": {
        "start": "ng serve",
        "lint": "eslint src --max-warnings 0"
    }
}
CODE,
        ],
        [
            'language' => 'yaml',
            'title' => 'CI GitHub Actions minimale',
            'description' => 'Lint + tests sur chaque push.',
            'code' => <<<'CODE'
name: ci
on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test
CODE,
        ],
    ];

    public function load(ObjectManager $manager): void
    {
        // (mot de passe : "password", cf. UserFactory)
        $demo  = UserFactory::createOne([
            'email' => 'demo@chillbox.dev',
            'firstName' => 'Maxence',
            'lastName' => 'Pequeno',
        ]);
        $other = UserFactory::createOne(['email' => 'other@chillbox.dev']);

        foreach ([[$demo, self::DEMO_SNIPPETS], [$other, self::OTHER_SNIPPETS]] as [$user, $samples]) {
            $folders = FolderFactory::createMany(2, ['owner' => $user]);

            foreach ($samples as $i => $sample) {
                SnippetFactory::createOne($sample + [
                    'owner' => $user,
                    // 3 snippets dans chaque dossier, les 4 derniers hors dossier
                    'folders' => $i < 6 ? [$folders[intdiv($i, 3)]] : [],
                ]);
            }
        }
    }
}
