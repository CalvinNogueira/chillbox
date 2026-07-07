<?php

namespace App\Entity;

use App\Repository\SnippetRepository;
use App\State\OwnerProcessor;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use ApiPlatform\Metadata\{ApiResource, ApiFilter, GetCollection, Get, Post, Put, Patch, Delete};
use ApiPlatform\Doctrine\Orm\Filter\{SearchFilter, OrderFilter};

#[ORM\Entity(repositoryClass: SnippetRepository::class)]
#[ApiResource(
    normalizationContext:   ['groups' => ['snippet:read']],
    denormalizationContext: ['groups' => ['snippet:write']],
    operations: [
        new GetCollection(security: "is_granted('ROLE_USER')"),
        new Get(security: "is_granted('ROLE_USER')"),
        new Post(security: "is_granted('ROLE_USER')", processor: OwnerProcessor::class),
        new Put(security: "object.getOwner() == user"),
        new Patch(security: "object.getOwner() == user"),
        new Delete(security: "object.getOwner() == user"),
    ]
)]
#[ApiFilter(SearchFilter::class, properties: [
    'title'       => 'ipartial',
    'description' => 'ipartial',
    'code'        => 'ipartial',
    'owner'       => 'exact',
    'folders'     => 'exact',
])]
#[ApiFilter(OrderFilter::class, properties: ['id', 'title'])]
class Snippet
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['snippet:read'])]
    private ?int $id = null;

    #[Groups(['snippet:read', 'snippet:write'])]
    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[Groups(['snippet:read', 'snippet:write'])]
    #[ORM\Column(type: Types::TEXT)]
    private ?string $code = null;

    #[Groups(['snippet:read', 'snippet:write'])]
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    #[Groups(['snippet:read', 'snippet:write'])]
    #[ORM\Column(length: 50, nullable: true)]
    private ?string $language = null;

    #[ORM\ManyToOne(inversedBy: 'snippets')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['snippet:read'])]
    private ?User $owner = null;

    /**
     * @var Collection<int, Folder>
     */
    #[ORM\ManyToMany(targetEntity: Folder::class, mappedBy: 'snippets')]
    #[Groups(['snippet:read', 'snippet:write'])]
    private Collection $folders;

    public function __construct()
    {
        $this->folders = new ArrayCollection();
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

    public function getCode(): ?string
    {
        return $this->code;
    }

    public function setCode(string $code): static
    {
        $this->code = $code;

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

    public function getLanguage(): ?string
    {
        return $this->language;
    }

    public function setLanguage(?string $language): static
    {
        $this->language = $language;

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
     * @return Collection<int, Folder>
     */
    public function getFolders(): Collection
    {
        return $this->folders;
    }

    public function addFolder(Folder $folder): static
    {
        if (!$this->folders->contains($folder)) {
            $this->folders->add($folder);
            $folder->addSnippet($this);
        }

        return $this;
    }

    public function removeFolder(Folder $folder): static
    {
        if ($this->folders->removeElement($folder)) {
            $folder->removeSnippet($this);
        }

        return $this;
    }
}
