import React, { useMemo } from 'react'
import { getKeywordsForNews, getTopicGroups } from '../data/db'
import NewsCard from './NewsCard'

export default function WeeklyBriefing({ news, onUpdate }) {
  const topicGroups = getTopicGroups()

  const featured = useMemo(
    () => news.filter((n) => n.is_featured),
    [news]
  )

  // 주차별 그룹핑
  const byWeek = useMemo(() => {
    const map = {}
    for (const n of featured) {
      if (!map[n.week_label]) map[n.week_label] = []
      map[n.week_label].push(n)
    }
    return Object.entries(map).sort(([a], [b]) => b.localeCompare(a))
  }, [featured])

  // topic_group_id 기준으로 묶기
  const groupNewsItems = (items) => {
    const grouped = []
    const seen = new Set()
    for (const item of items) {
      if (seen.has(item.id)) continue
      if (item.topic_group_id) {
        const siblings = items.filter(
          (n) => n.topic_group_id === item.topic_group_id
        )
        const group = getTopicGroup(item.topic_group_id)
        grouped.push({ type: 'group', items: siblings, group })
        siblings.forEach((s) => seen.add(s.id))
      } else {
        grouped.push({ type: 'single', items: [item], group: null })
        seen.add(item.id)
      }
    }
    return grouped
  }

  const getTopicGroup = (id) => topicGroups.find((g) => g.id === id)

  if (featured.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📋</div>
        <p>이번 주 주요 기사가 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>📋 주간 브리핑</h2>
        <span className="tab-count">주요 기사 {featured.length}건</span>
      </div>

      {byWeek.map(([week, items]) => {
        const groups = groupNewsItems(items)
        return (
          <section key={week} className="week-section">
            <div className="week-label-bar">
              <span className="week-label-text">📅 {formatWeekLabel(week)}</span>
              <span className="week-count">{items.length}건</span>
            </div>

            <div className="news-list">
              {groups.map((g, gi) => {
                if (g.type === 'group' && g.items.length > 1) {
                  return (
                    <div key={gi} className="topic-group">
                      <div className="topic-group-header">
                        <span className="topic-group-icon">🗂️</span>
                        <span className="topic-group-title">{g.group?.title || '관련 기사 묶음'}</span>
                        <span className="topic-group-badge">{g.items.length}개 매체</span>
                      </div>
                      <div className="topic-group-items">
                        {g.items.map((n) => (
                          <NewsCard key={n.id} news={n} onUpdate={onUpdate} />
                        ))}
                      </div>
                    </div>
                  )
                }
                return (
                  <NewsCard
                    key={g.items[0].id}
                    news={g.items[0]}
                    onUpdate={onUpdate}
                  />
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}

function formatWeekLabel(label) {
  const [year, wPart] = label.split('-')
  const week = wPart.replace('W', '')
  return `${year}년 ${parseInt(week)}주차`
}
