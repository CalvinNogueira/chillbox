<?php

namespace App\DataFixtures;

use App\Factory\FolderFactory;
use App\Factory\SnippetFactory;
use App\Factory\UserFactory;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

final class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // deux comptes connus pour tester le login et le cloisonnement par owner
        // (mot de passe : "password", cf. UserFactory)
        $demo  = UserFactory::createOne(['email' => 'demo@chillbox.dev']);
        $other = UserFactory::createOne(['email' => 'other@chillbox.dev']);

        foreach ([$demo, $other] as $user) {
            FolderFactory::createMany(2, [
                'owner' => $user,
                'snippets' => SnippetFactory::new(['owner' => $user])->many(3),
            ]);

            // quelques snippets hors dossier
            SnippetFactory::createMany(4, ['owner' => $user]);
        }
    }
}
