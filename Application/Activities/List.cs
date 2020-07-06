using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class ActivitiesEnvelope
        {
            public List<ActivityDTO> Activities { get; set; }
            public int ActivityCount { get; set; }
        }

        public class Query : IRequest<ActivitiesEnvelope>
        {
            public Query(int? limit, int? offSet, bool isGoing, bool isHost, DateTime? startDate)
            {
                Limit = limit;
                OffSet = offSet;
                IsHost = isHost;
                IsGoing = isGoing;
                StartDate = startDate ?? DateTime.Now;
            }

            public int? Limit { get; set; }
            public int? OffSet { get; set; }
            public bool IsHost { get; set; }
            public bool IsGoing { get; set; }
            public DateTime? StartDate { get; set; }
        }

        public class Handler : IRequestHandler<Query, ActivitiesEnvelope>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _mapper = mapper;
                _context = context;
            }

            public async Task<ActivitiesEnvelope> Handle(Query request, CancellationToken cancellationToken)
            {
                var queryable = _context.Activities
                                    .Where(c => c.Date >= request.StartDate)
                                    .OrderBy(c => c.Date)
                                    .AsQueryable();

                if (request.IsGoing && !request.IsHost)
                {
                    queryable = queryable.Where(c => c.UserActivities.Any(a => a.AppUser.UserName == _userAccessor.GetCurrentUsername()));
                }

                if (!request.IsGoing && request.IsHost)
                {
                    queryable = queryable.Where(c => c.UserActivities.Any(a =>
                    a.AppUser.UserName == _userAccessor.GetCurrentUsername() && a.IsHost));
                }

                var activities = await queryable.Skip(request.OffSet ?? 0).Take(request.Limit ?? 3).ToListAsync();

                return new ActivitiesEnvelope
                {
                    Activities = _mapper.Map<List<Activity>, List<ActivityDTO>>(activities),
                    ActivityCount = queryable.Count()
                };
            }
        }
    }
}