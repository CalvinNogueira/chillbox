<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use Symfony\Bundle\SecurityBundle\Security;

/**
 * Miroir en lecture des processors : au lieu de chercher la ressource
 * via l'id de l'URL (comportement par défaut), on renvoie le user
 * identifié par le token JWT de la requête.
 */
final class CurrentUserProvider implements ProviderInterface
{
    public function __construct(private Security $security)
    {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        return $this->security->getUser();
    }
}
