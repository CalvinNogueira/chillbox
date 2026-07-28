<?php

namespace App\Factory;

use App\Entity\Folder;
use Zenstruck\Foundry\Persistence\PersistentObjectFactory;

/**
 * @extends PersistentObjectFactory<Folder>
 */
final class FolderFactory extends PersistentObjectFactory
{
    public static function class(): string
    {
        return Folder::class;
    }

    protected function defaults(): array
    {
        return [
            'title' => self::faker()->words(2, true),
            'description' => self::faker()->optional()->sentence(),
            'owner' => UserFactory::new(),
        ];
    }
}
