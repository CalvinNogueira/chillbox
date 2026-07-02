<?php

namespace App\Factory;

use App\Entity\Snippet;
use Zenstruck\Foundry\Persistence\PersistentObjectFactory;

/**
 * @extends PersistentObjectFactory<Snippet>
 */
final class SnippetFactory extends PersistentObjectFactory
{
    public static function class(): string
    {
        return Snippet::class;
    }

    protected function defaults(): array
    {
        return [
            'title' => self::faker()->sentence(3),
            'code' => sprintf("function %s() {\n    return '%s';\n}", self::faker()->word(), self::faker()->word()),
            'description' => self::faker()->optional()->sentence(),
            'owner' => UserFactory::new(),
        ];
    }
}
