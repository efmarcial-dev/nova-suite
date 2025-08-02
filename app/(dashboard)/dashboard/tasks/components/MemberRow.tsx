

const members = [
  { name: 'Eduardo', image: 'https://i.pravatar.cc/150?img=3' },
  { name: 'Ana', image: 'https://i.pravatar.cc/150?img=5' },
  { name: 'Luis', image: 'https://i.pravatar.cc/150?img=7' },
  { name: 'Carla', image: 'https://i.pravatar.cc/150?img=9' },
  { name: 'Mateo', image: 'https://i.pravatar.cc/150?img=11' },
]

export default function MemberRow() {
    return (
        <div className="flex items-center gap-[-8px]">
            {members.map((member, index) =>(
                <img
                    key={index}
                    src={member.image}
                    alt={member.name}
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    title={member.name}
                />
            ))}
        </div>
    );
}