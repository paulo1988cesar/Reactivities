using System.Linq;
using AutoMapper;
using Domain;

namespace Application.Activities
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Activity, ActivityDTO>();
            CreateMap<UserActivity, AttedeeDTO>()
                .ForMember(d => d.UserName, o => o.MapFrom(s => s.AppUser.UserName))
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(c => c.Image, o => o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(c => c.IsMain).Url))
                .ForMember(c => c.Following, o => o.MapFrom<FollowingResolver>());
        }
    }
}