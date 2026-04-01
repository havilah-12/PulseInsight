interface ProfileAvatarProps {
  name: string;
  photoUrl?: string | null;
  className?: string;
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "PT";

const ProfileAvatar = ({ name, photoUrl, className = "" }: ProfileAvatarProps) => {
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={`${name} profile`}
        className={`h-16 w-16 rounded-2xl object-cover border border-white/20 shadow-md ${className}`}
      />
    );
  }

  return (
    <div
      className={`h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-md ${className}`}
      aria-label={`${name} avatar`}
    >
      {getInitials(name)}
    </div>
  );
};

export default ProfileAvatar;
