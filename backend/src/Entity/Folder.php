<?php

namespace App\Entity;

use App\Repository\FolderRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use ApiPlatform\Metadata\{ApiResource, ApiFilter, GetCollection, Get, Post, Put, Patch, Delete};
use ApiPlatform\Doctrine\Orm\Filter\{SearchFilter, OrderFilter};

#[ORM\Entity(repositoryClass: FolderRepository::class)]
#[ApiResource(
    normalizationContext:   ['groups' => ['folder:read']],
    denormalizationContext: ['groups' => ['folder:write']],
    operations: [
        new GetCollection(security: "is_granted('ROLE_USER')"),
        new Get(security: "is_granted('ROLE_USER')"),
        new Post(security: "is_granted('ROLE_USER')"),
        new Put(security: "object.getOwner() == user"),
        new Patch(security: "object.getOwner() == user"),
        new Delete(security: "object.getOwner() == user"),
    ]
)]
#[ApiFilter(SearchFilter::class, properties: [
    'title'       => 'ipartial',
    'description' => 'ipartial',
    'owner'       => 'exact',
])]
#[ApiFilter(OrderFilter::class, properties: ['id', 'title'])]
class Folder
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['folder:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['folder:read', 'folder:write'])]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['folder:read', 'folder:write'])]
    private ?string $description = null;

    #[ORM\ManyToOne(inversedBy: 'folders')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['folder:read'])]
    private ?User $owner = null;

    /**
     * @var Collection<int, Snippet>
     */
    #[ORM\ManyToMany(targetEntity: Snippet::class, inversedBy: 'folders')]
    #[Groups(['folder:read', 'folder:write'])]
    private Collection $snippets;

    public function __construct()
    {
        $this->snippets = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getOwner(): ?User
    {
        return $this->owner;
    }

    public function setOwner(?User $owner): static
    {
        $this->owner = $owner;

        return $this;
    }

    /**
     * @return Collection<int, Snippet>
     */
    public function getSnippets(): Collection
    {
        return $this->snippets;
    }

    public function addSnippet(Snippet $snippet): static
    {
        if (!$this->snippets->contains($snippet)) {
            $this->snippets->add($snippet);
        }

        return $this;
    }

    public function removeSnippet(Snippet $snippet): static
    {
        $this->snippets->removeElement($snippet);

        return $this;
    }
}
