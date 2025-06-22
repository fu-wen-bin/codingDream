document.addEventListener('DOMContentLoaded', () => {
    // 初始化函数
    initEventListeners()
    initSections()
    updatePreview()
    updateProgress()

    // 全屏预览
    document.getElementById('fullscreen-preview').
        addEventListener('click', toggleFullscreen)

    // 打印预览
    document.getElementById('print-preview').addEventListener('click', () => {
        window.print()
    })
})

// 初始化所有事件监听器
function initEventListeners () {
    // 监听所有输入元素变化
    const formInputs = document.querySelectorAll('input, textarea, select')
    formInputs.forEach(input => {
        const eventType = (input.type === 'checkbox' ||
            input.tagName.toLowerCase() === 'select') ? 'change' : 'input'
        input.addEventListener(eventType, () => {
            updatePreview()
            updateProgress()
            if (input.tagName.toLowerCase() === 'textarea') {
                updateCharCounter(input)
            }
        })
    })

    // 初始化字符计数器
    document.querySelectorAll('textarea').forEach(textarea => {
        updateCharCounter(textarea)
    })

    // 主题切换
    document.getElementById('theme-selector').addEventListener('change', (e) => {
        const preview = document.getElementById('resume-preview')
        // 移除所有主题类
        preview.classList.forEach(cls => {
            if (cls.startsWith('theme-')) {
                preview.classList.remove(cls)
            }
        })
        // 添加选择的主题类
        preview.classList.add('theme-' + e.target.value)
    })

    // 添加教育经历
    document.getElementById('add-education').
        addEventListener('click', addEducation)

    // 添加工作经验
    document.getElementById('add-experience').
        addEventListener('click', addExperience)

    // 添加项目经验
    document.getElementById('add-project').addEventListener('click', addProject)

    // 导出PDF
    document.getElementById('export-pdf').addEventListener('click', exportToPDF)

    // 保存模板
    document.getElementById('save-template').
        addEventListener('click', saveTemplate)

    // 折叠/展开部分
    document.querySelectorAll('.section-header').forEach(header => {
        header.addEventListener('click', toggleSection)
    })

    // AI润色按钮
    document.getElementById('ai-polish-btn').
        addEventListener('click', polishSummaryWithAI)

    // 为动态添加的教育经历润色按钮绑定事件
    document.addEventListener('click', function (e) {
        if (e.target.closest('.education-polish-btn')) {
            polishEducationWithAI(e.target.closest('.education-polish-btn'))
        }
        if (e.target.closest('.experience-polish-btn')) {
            polishExperienceWithAI(e.target.closest('.experience-polish-btn'))
        }
        if (e.target.closest('.skills-polish-btn')) {
            polishSkillsWithAI(e.target.closest('.skills-polish-btn'))
        }
        if (e.target.closest('.project-polish-btn')) {
            polishProjectWithAI(e.target.closest('.project-polish-btn'))
        }
    })
}

// 初始化各部分折叠状态
function initSections () {
    // 默认展开第一个部分，折叠其他部分
    const sections = document.querySelectorAll('.form-section')
    sections.forEach((section, index) => {
        if (index === 0) {
            section.classList.add('active')
        } else {
            section.classList.add('collapsed')
        }
    })
}

// 更新字符计数
function updateCharCounter (textarea) {
    if (!textarea) return

    const counter = textarea.nextElementSibling?.querySelector('span')
    if (counter) {
        counter.textContent = textarea.value.length
    }
}

// 切换部分折叠状态
function toggleSection (e) {
    const section = e.currentTarget.closest('.form-section')
    section.classList.toggle('collapsed')

    const icon = e.currentTarget.querySelector('.fa-chevron-down')
    if (icon) {
        icon.style.transform = section.classList.contains('collapsed')
            ? 'rotate(-90deg)'
            : ''
    }
}

// 全屏预览
function toggleFullscreen () {
    const preview = document.getElementById('resume-preview')
    if (!document.fullscreenElement) {
        preview.requestFullscreen().catch(err => {
            showMessage('全屏模式不可用', 'error')
        })
    } else {
        document.exitFullscreen()
    }
}

// 添加教育经历
function addEducation () {
    const container = document.getElementById('education-container')
    const count = container.querySelectorAll('.education-item').length + 1

    const item = document.createElement('div')
    item.className = 'education-item'
    item.innerHTML = `
                <div class="item-header">
                    <h4><i class="fas fa-university"></i> 教育经历 #${count}</h4>
                    <button type="button" class="remove-item-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label><i class="fas fa-school"></i> 学校名称</label>
                        <input type="text" class="school-name" placeholder="大学/学院名称">
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-certificate"></i> 学历</label>
                        <select class="degree">
                            <option value="">选择学历</option>
                            <option value="高中">高中</option>
                            <option value="专科">专科</option>
                            <option value="本科">本科</option>
                            <option value="硕士">硕士</option>
                            <option value="博士">博士</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label><i class="fas fa-book"></i> 专业</label>
                        <input type="text" class="major" placeholder="所学专业">
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-star"></i> GPA/成绩</label>
                        <input type="text" class="gpa" placeholder="如：3.8/4.0 或 优秀">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label><i class="fas fa-calendar-alt"></i> 开始时间</label>
                        <input type="month" class="start-date">
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-calendar-check"></i> 结束时间</label>
                        <input type="month" class="end-date">
                    </div>
                </div>
                <div class="form-group">
                    <label><i class="fas fa-trophy"></i> 主要成就/课程</label>
                    <textarea class="achievements" placeholder="相关课程、获奖情况、学术成就等..."></textarea>
                </div>
            `

    container.appendChild(item)

    // 绑定删除按钮事件
    const removeBtn = item.querySelector('.remove-item-btn')
    removeBtn.addEventListener('click', function () {
        container.removeChild(item)
        updatePreview()
        updateProgress()
        renumberItems('education')
    })

    // 绑定新添加项的输入事件
    const inputs = item.querySelectorAll('input, textarea, select')
    inputs.forEach(input => {
        const eventType = (input.type === 'checkbox' ||
            input.tagName.toLowerCase() === 'select') ? 'change' : 'input'
        input.addEventListener(eventType, () => {
            updatePreview()
            updateProgress()
            if (input.tagName.toLowerCase() === 'textarea') {
                updateCharCounter(input)
            }
        })
    })

    // 更新预览
    updatePreview()
    updateProgress()

    // 显示第一个删除按钮
    showFirstItemRemoveBtn('education')
}

// 添加工作经验
function addExperience () {
    const container = document.getElementById('experience-container')
    const count = container.querySelectorAll('.experience-item').length + 1

    const item = document.createElement('div')
    item.className = 'experience-item'
    item.innerHTML = `
                <div class="item-header">
                    <h4><i class="fas fa-building"></i> 工作经验 #${count}</h4>
                    <button type="button" class="remove-item-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label><i class="fas fa-building"></i> 公司名称</label>
                        <input type="text" class="company-name" placeholder="公司/单位名称">
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-user-tie"></i> 职位</label>
                        <input type="text" class="position" placeholder="担任职位">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label><i class="fas fa-calendar-alt"></i> 开始时间</label>
                        <input type="month" class="start-date">
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-calendar-check"></i> 结束时间</label>
                        <input type="month" class="end-date">
                        <div class="current-job">
                            <input type="checkbox" class="current-position" id="current-${count}">
                            <label for="current-${count}">目前在职</label>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label><i class="fas fa-tasks"></i> 工作描述</label>
                    <textarea class="description" placeholder="描述您的主要职责、工作成果和技能运用..."></textarea>
                    <div class="char-counter">
                        <span class="desc-count">0</span>/1000 字符
                    </div>
                </div>
            `

    container.appendChild(item)

    // 绑定删除按钮事件
    const removeBtn = item.querySelector('.remove-item-btn')
    removeBtn.addEventListener('click', function () {
        container.removeChild(item)
        updatePreview()
        updateProgress()
        renumberItems('experience')
    })

    // 绑定新添加项的输入事件
    const inputs = item.querySelectorAll('input, textarea, select')
    inputs.forEach(input => {
        const eventType = (input.type === 'checkbox' ||
            input.tagName.toLowerCase() === 'select') ? 'change' : 'input'
        input.addEventListener(eventType, () => {
            updatePreview()
            updateProgress()
            if (input.tagName.toLowerCase() === 'textarea') {
                updateCharCounter(input)
            }
        })
    })

    // 当前工作复选框逻辑
    const currentCheckbox = item.querySelector('.current-position')
    const endDateInput = item.querySelector('.end-date')

    currentCheckbox.addEventListener('change', function () {
        if (this.checked) {
            endDateInput.value = ''
            endDateInput.disabled = true
        } else {
            endDateInput.disabled = false
        }
        updatePreview()
    })

    // 更新预览
    updatePreview()
    updateProgress()

    // 显示第一个删除按钮
    showFirstItemRemoveBtn('experience')
}

// 添加项目经验
function addProject () {
    const container = document.getElementById('projects-container')
    const count = container.querySelectorAll('.project-item').length + 1

    const item = document.createElement('div')
    item.className = 'project-item'
    item.innerHTML = `
                <div class="item-header">
                    <h4><i class="fas fa-rocket"></i> 项目经验 #${count}</h4>
                    <button type="button" class="remove-item-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label><i class="fas fa-tag"></i> 项目名称</label>
                        <input type="text" class="project-name" placeholder="项目名称">
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-link"></i> 项目链接</label>
                        <input type="url" class="project-url" placeholder="项目演示或代码链接">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label><i class="fas fa-calendar-alt"></i> 开始时间</label>
                        <input type="month" class="project-start">
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-calendar-check"></i> 结束时间</label>
                        <input type="month" class="project-end">
                    </div>
                </div>
                <div class="form-group">
                    <label><i class="fas fa-code"></i> 技术栈</label>
                    <input type="text" class="project-tech" placeholder="使用的技术和工具">
                </div>
                <div class="form-group">
                    <label><i class="fas fa-info-circle"></i> 项目描述</label>
                    <textarea class="project-description" placeholder="项目背景、主要功能、个人贡献和成果..."></textarea>
                </div>
            `

    container.appendChild(item)

    // 绑定删除按钮事件
    const removeBtn = item.querySelector('.remove-item-btn')
    removeBtn.addEventListener('click', function () {
        container.removeChild(item)
        updatePreview()
        updateProgress()
        renumberItems('project')
    })

    // 绑定新添加项的输入事件
    const inputs = item.querySelectorAll('input, textarea, select')
    inputs.forEach(input => {
        const eventType = (input.type === 'checkbox' ||
            input.tagName.toLowerCase() === 'select') ? 'change' : 'input'
        input.addEventListener(eventType, () => {
            updatePreview()
            updateProgress()
            if (input.tagName.toLowerCase() === 'textarea') {
                updateCharCounter(input)
            }
        })
    })

    // 显示项目经验部分
    document.getElementById('projects-section').style.display = 'block'

    // 更新预览
    updatePreview()
    updateProgress()

    // 显示第一个删除按钮
    showFirstItemRemoveBtn('project')
}

// 显示第一个条目的删除按钮
function showFirstItemRemoveBtn (type) {
    let selector = ''
    switch (type) {
        case 'education':
            selector = '.education-item'
            break
        case 'experience':
            selector = '.experience-item'
            break
        case 'project':
            selector = '.project-item'
            break
    }

    const items = document.querySelectorAll(selector)
    if (items.length > 1) {
        items.forEach(item => {
            item.querySelector('.remove-item-btn').style.display = 'block'
        })
    } else if (items.length === 1) {
        items[0].querySelector('.remove-item-btn').style.display = 'none'
    }
}

// 重新编号项目
function renumberItems (type) {
    let selector = ''
    let titlePrefix = ''

    switch (type) {
        case 'education':
            selector = '.education-item'
            titlePrefix = '教育经历'
            break
        case 'experience':
            selector = '.experience-item'
            titlePrefix = '工作经验'
            break
        case 'project':
            selector = '.project-item'
            titlePrefix = '项目经验'
            break
    }

    const items = document.querySelectorAll(selector)
    items.forEach((item, index) => {
        const header = item.querySelector('h4')
        let icon = ''

        switch (type) {
            case 'education':
                icon = '<i class="fas fa-university"></i>'
                break
            case 'experience':
                icon = '<i class="fas fa-building"></i>'
                break
            case 'project':
                icon = '<i class="fas fa-rocket"></i>'
                break
        }

        header.innerHTML = `${icon} ${titlePrefix} #${index + 1}`

        if (type === 'experience') {
            const checkbox = item.querySelector('.current-position')
            const label = item.querySelector('.current-job label')

            checkbox.id = `current-${index + 1}`
            label.setAttribute('for', `current-${index + 1}`)
        }
    })
}

// 导出PDF
function exportToPDF () {
    const element = document.getElementById('resume-preview')
    const resumeContent = element.querySelector('.resume-content')

    // 显示加载状态
    const exportBtn = document.getElementById('export-pdf')
    const originalBtnContent = exportBtn.innerHTML
    exportBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 正在生成...'
    exportBtn.disabled = true

    // 准备PDF选项
    const opt = {
        margin: 10,
        filename: '我的简历.pdf',
        image: {type: 'jpeg', quality: 0.98},
        html2canvas: {scale: 2, useCORS: true},
        jsPDF: {unit: 'mm', format: 'a4', orientation: 'portrait'},
    }

    // 生成PDF
    html2pdf().from(resumeContent).set(opt).save().then(() => {
        // 恢复按钮状态
        exportBtn.innerHTML = originalBtnContent
        exportBtn.disabled = false
        showMessage('简历已成功导出为PDF！', 'success')
    }).catch(err => {
        console.error('PDF导出失败:', err)
        exportBtn.innerHTML = originalBtnContent
        exportBtn.disabled = false
        showMessage('PDF导出失败，请重试', 'error')
    })
}

// 保存模板
function saveTemplate () {
    try {
        const formData = {
            personalInfo: {
                name: document.getElementById('fullname')?.value || '',
                title: document.getElementById('title')?.value || '',
                email: document.getElementById('email')?.value || '',
                phone: document.getElementById('phone')?.value || '',
                location: document.getElementById('location')?.value || '',
                website: document.getElementById('website')?.value || '',
                summary: document.getElementById('summary')?.value || '',
            },
            theme: document.getElementById('theme-selector')?.value || 'classic',
            education: getEducationData(),
            experience: getExperienceData(),
            skills: getSkillsData(),
            projects: getProjectsData(),
        }

        localStorage.setItem('resumeTemplate', JSON.stringify(formData))
        showMessage('简历模板已保存！', 'success')
    } catch (error) {
        console.error('保存模板失败:', error)
        showMessage('保存模板失败，请重试', 'error')
    }
}

// 获取教育数据
function getEducationData () {
    const educationItems = document.querySelectorAll('.education-item')
    const data = []

    educationItems.forEach(item => {
        data.push({
            school: item.querySelector('.school-name')?.value || '',
            degree: item.querySelector('.degree')?.value || '',
            major: item.querySelector('.major')?.value || '',
            gpa: item.querySelector('.gpa')?.value || '',
            startDate: item.querySelector('.start-date')?.value || '',
            endDate: item.querySelector('.end-date')?.value || '',
            achievements: item.querySelector('.achievements')?.value || '',
        })
    })

    return data
}

// 获取工作经验数据
function getExperienceData () {
    const experienceItems = document.querySelectorAll('.experience-item')
    const data = []

    experienceItems.forEach(item => {
        data.push({
            company: item.querySelector('.company-name')?.value || '',
            position: item.querySelector('.position')?.value || '',
            startDate: item.querySelector('.start-date')?.value || '',
            endDate: item.querySelector('.end-date')?.value || '',
            current: item.querySelector('.current-position')?.checked || false,
            description: item.querySelector('.description')?.value || '',
        })
    })

    return data
}

// 获取技能数据
function getSkillsData () {
    return {
        programming: document.getElementById('programming-skills')?.value || '',
        frameworks: document.getElementById('framework-skills')?.value || '',
        languages: document.getElementById('language-skills')?.value || '',
        other: document.getElementById('other-skills')?.value || '',
    }
}

// 获取项目数据
function getProjectsData () {
    const projectItems = document.querySelectorAll('.project-item')
    const data = []

    projectItems.forEach(item => {
        data.push({
            name: item.querySelector('.project-name')?.value || '',
            url: item.querySelector('.project-url')?.value || '',
            startDate: item.querySelector('.project-start')?.value || '',
            endDate: item.querySelector('.project-end')?.value || '',
            tech: item.querySelector('.project-tech')?.value || '',
            description: item.querySelector('.project-description')?.value || '',
        })
    })

    return data
}

// 更新预览
function updatePreview () {
    // 更新个人信息
    updatePersonalInfo()

    // 更新教育经历
    updateEducation()

    // 更新工作经验
    updateExperience()

    // 更新技能
    updateSkills()

    // 更新项目经验
    updateProjects()
}

// 更新个人信息预览
function updatePersonalInfo () {
    const name = document.getElementById('fullname')?.value
    const title = document.getElementById('title')?.value
    const email = document.getElementById('email')?.value
    const phone = document.getElementById('phone')?.value
    const location = document.getElementById('location')?.value
    const website = document.getElementById('website')?.value
    const summary = document.getElementById('summary')?.value

    // 更新姓名和职位
    document.getElementById('preview-name').textContent = name || '您的姓名'
    document.getElementById('preview-title').textContent = title || '职位头衔'

    // 更新联系方式
    document.getElementById('preview-email').textContent = email || '邮箱地址'
    document.getElementById('preview-phone').textContent = phone || '联系电话'
    document.getElementById('preview-location').textContent = location ||
        '所在地'

    // 更新网站（如果有）
    const websiteContainer = document.getElementById('preview-website-container')
    const websiteLink = document.getElementById('preview-website')

    if (website) {
        websiteContainer.style.display = 'flex'
        websiteLink.textContent = website
        websiteLink.href = website.startsWith('http')
            ? website
            : `https://${website}`
    } else {
        websiteContainer.style.display = 'none'
    }

    // 更新个人简介
    document.getElementById('preview-summary').textContent = summary ||
        '个人简介内容将显示在这里...'
}

// 更新教育经历预览
function updateEducation () {
    const educationItems = document.querySelectorAll('.education-item')
    const previewEducation = document.getElementById('preview-education')

    // 清空现有内容
    previewEducation.innerHTML = ''

    if (educationItems.length === 0) {
        previewEducation.innerHTML = '<p class="empty-notice">尚未添加教育经历</p>'
        return
    }

    educationItems.forEach(item => {
        const school = item.querySelector('.school-name').value
        const degree = item.querySelector('.degree').value
        const major = item.querySelector('.major').value
        const gpa = item.querySelector('.gpa').value
        const startDate = item.querySelector('.start-date').value
        const endDate = item.querySelector('.end-date').value
        const achievements = item.querySelector('.achievements').value

        if (!school && !degree && !major) return // 忽略空条目

        const educationEntry = document.createElement('div')
        educationEntry.className = 'education-entry'

        let html = `
                    <h3>${school || '学校名称'}</h3>
                    <div class="degree">${degree || '学历'} ${major
                ? `· ${major}`
                : ''}</div>
                    <div class="date-location">
                        ${formatDate(startDate)} - ${endDate ? formatDate(
                    endDate) : '至今'}
                        ${gpa ? `| GPA: ${gpa}` : ''}
                    </div>
                `

        if (achievements) {
            html += `<div class="achievements">${achievements}</div>`
        }

        educationEntry.innerHTML = html
        previewEducation.appendChild(educationEntry)
    })

    if (previewEducation.children.length === 0) {
        previewEducation.innerHTML = '<p class="empty-notice">尚未添加教育经历</p>'
    }
}

// 更新工作经验预览
function updateExperience () {
    const experienceItems = document.querySelectorAll('.experience-item')
    const previewExperience = document.getElementById('preview-experience')

    // 清空现有内容
    previewExperience.innerHTML = ''

    if (experienceItems.length === 0) {
        previewExperience.innerHTML = '<p class="empty-notice">尚未添加工作经验</p>'
        return
    }

    experienceItems.forEach(item => {
        const company = item.querySelector('.company-name').value
        const position = item.querySelector('.position').value
        const startDate = item.querySelector('.start-date').value
        const endDate = item.querySelector('.end-date').value
        const isCurrent = item.querySelector('.current-position').checked
        const description = item.querySelector('.description').value

        if (!company && !position) return // 忽略空条目

        const experienceEntry = document.createElement('div')
        experienceEntry.className = 'experience-entry'

        let html = `
                    <h3>${company || '公司名称'}</h3>
                    <div class="position">${position || '职位'}</div>
                    <div class="date-location">
                        ${formatDate(startDate)} - ${isCurrent
                ? '至今'
                : (endDate ? formatDate(endDate) : '至今')}
                    </div>
                `

        if (description) {
            html += `<div class="description">${description}</div>`
        }

        experienceEntry.innerHTML = html
        previewExperience.appendChild(experienceEntry)
    })

    if (previewExperience.children.length === 0) {
        previewExperience.innerHTML = '<p class="empty-notice">尚未添加工作经验</p>'
    }
}

// 更新技能预览
function updateSkills () {
    const programmingSkills = document.getElementById(
        'programming-skills')?.value
    const frameworkSkills = document.getElementById('framework-skills')?.value
    const languageSkills = document.getElementById('language-skills')?.value
    const otherSkills = document.getElementById('other-skills')?.value

    const previewSkills = document.getElementById('preview-skills')

    // 清空现有内容
    previewSkills.innerHTML = ''

    // 如果所有技能都为空，显示提示信息
    if (!programmingSkills && !frameworkSkills && !languageSkills &&
        !otherSkills) {
        previewSkills.innerHTML = '<p class="empty-notice">尚未添加技能</p>'
        return
    }

    // 创建技能分组容器
    const skillsContainer = document.createElement('div')
    skillsContainer.className = 'skills-container'

    // 处理编程语言技能
    if (programmingSkills) {
        const group = createSkillGroup('编程语言', '<i class="fas fa-code"></i>',
            programmingSkills)
        skillsContainer.appendChild(group)
    }

    // 处理框架/工具技能
    if (frameworkSkills) {
        const group = createSkillGroup('框架/工具', '<i class="fas fa-tools"></i>',
            frameworkSkills)
        skillsContainer.appendChild(group)
    }

    // 处理语言能力
    if (languageSkills) {
        const group = createSkillGroup('语言能力',
            '<i class="fas fa-language"></i>', languageSkills)
        skillsContainer.appendChild(group)
    }

    // 处理其他技能
    if (otherSkills) {
        const group = createSkillGroup('其他技能',
            '<i class="fas fa-lightbulb"></i>', otherSkills)
        skillsContainer.appendChild(group)
    }

    previewSkills.appendChild(skillsContainer)
}

// 创建技能组
function createSkillGroup (title, icon, skills) {
    const group = document.createElement('div')
    group.className = 'skill-group'

    const heading = document.createElement('h4')
    heading.innerHTML = `${icon} ${title}`
    group.appendChild(heading)

    const skillsList = document.createElement('div')
    skillsList.className = 'skills-list'

    // 分割技能
    const skillArray = skills.split(/[,，;；、\n]+/).
        filter(skill => skill.trim() !== '')

    skillArray.forEach(skill => {
        if (skill.trim()) {
            const tag = document.createElement('div')
            tag.className = 'skill-tag'
            tag.textContent = skill.trim()
            skillsList.appendChild(tag)
        }
    })

    group.appendChild(skillsList)
    return group
}

// 更新项目经验预览
function updateProjects () {
    const projectItems = document.querySelectorAll('.project-item')
    const previewProjects = document.getElementById('preview-projects')
    const projectSection = document.getElementById('projects-section')

    // 清空现有内容
    previewProjects.innerHTML = ''

    // 检查是否有项目
    if (projectItems.length === 0) {
        projectSection.style.display = 'none'
        return
    } else {
        projectSection.style.display = 'block'
    }

    let hasValidProject = false

    projectItems.forEach(item => {
        const name = item.querySelector('.project-name').value
        const url = item.querySelector('.project-url').value
        const startDate = item.querySelector('.project-start').value
        const endDate = item.querySelector('.project-end').value
        const tech = item.querySelector('.project-tech').value
        const description = item.querySelector('.project-description').value

        if (!name && !description) return // 忽略空条目

        hasValidProject = true

        const projectEntry = document.createElement('div')
        projectEntry.className = 'project-entry'

        let html = `
                    <h3>${name || '项目名称'}</h3>
                    <div class="date-location">
                        ${formatDate(startDate)} - ${endDate ? formatDate(
            endDate) : '至今'}
                    </div>
                `

        if (tech) {
            html += `<div class="project-tech">技术栈: ${tech}</div>`
        }

        if (description) {
            html += `<div class="description">${description}</div>`
        }

        if (url) {
            html += `
                        <div class="project-links">
                            <a href="${url}" class="project-link" target="_blank">
                                <i class="fas fa-external-link-alt"></i> 查看项目
                            </a>
                        </div>
                    `
        }

        projectEntry.innerHTML = html
        previewProjects.appendChild(projectEntry)
    })

    if (!hasValidProject) {
        previewProjects.innerHTML = '<p class="empty-notice">尚未添加项目经验</p>'
    }
}

// 更新表单完成进度
function updateProgress () {
    const requiredFields = [
        document.getElementById('fullname'),
        document.getElementById('email'),
        document.getElementById('phone'),
    ]

    const optionalSections = [
        {
            name: '教育经历',
            container: document.getElementById('education-container'),
            itemSelector: '.education-item',
            requiredFields: ['.school-name', '.degree'],
        },
        {
            name: '工作经验',
            container: document.getElementById('experience-container'),
            itemSelector: '.experience-item',
            requiredFields: ['.company-name', '.position'],
        },
        {
            name: '技能',
            fields: [
                document.getElementById('programming-skills'),
                document.getElementById('framework-skills'),
                document.getElementById('language-skills'),
                document.getElementById('other-skills'),
            ],
        },
        {
            name: '项目经验',
            container: document.getElementById('projects-container'),
            itemSelector: '.project-item',
            requiredFields: ['.project-name'],
        },
    ]

    // 计算必填字段完成比例
    const requiredTotal = requiredFields.length
    const requiredFilled = requiredFields.filter(
        field => field && field.value.trim() !== '').length

    // 计算可选部分完成情况
    let optionalTotal = optionalSections.length
    let optionalFilled = 0

    optionalSections.forEach(section => {
        if (section.fields) {
            // 简单字段组（如技能）
            const hasContent = section.fields.some(
                field => field && field.value.trim() !== '')
            if (hasContent) optionalFilled++
        } else if (section.container) {
            // 项目组（如教育、工作经验）
            const items = section.container.querySelectorAll(section.itemSelector)

            if (items.length > 0) {
                // 检查每个项目是否有填写必填字段
                const validItems = Array.from(items).some(item => {
                    return section.requiredFields.every(selector => {
                        const field = item.querySelector(selector)
                        return field && field.value.trim() !== ''
                    })
                })

                if (validItems) optionalFilled++
            }
        }
    })

    // 计算总进度（必填字段占60%，可选部分占40%）
    const requiredProgress = requiredTotal > 0 ? (requiredFilled /
        requiredTotal) * 60 : 0
    const optionalProgress = optionalTotal > 0 ? (optionalFilled /
        optionalTotal) * 40 : 0
    const totalProgress = Math.min(
        Math.round(requiredProgress + optionalProgress), 100)

    // 更新进度条
    document.getElementById('form-progress').style.width = `${totalProgress}%`
    document.getElementById(
        'progress-percentage').textContent = `${totalProgress}%`
}

// 格式化日期
function formatDate (dateString) {
    if (!dateString) return ''

    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = date.getMonth() + 1

    return `${year}年${month}月`
}

// 清空个人信息
function clearPersonalInfo () {
    if (confirm('确定要清空所有个人信息吗？此操作不可撤销。')) {
        // 清空个人信息字段
        document.getElementById('fullname').value = ''
        document.getElementById('title').value = ''
        document.getElementById('email').value = ''
        document.getElementById('phone').value = ''
        document.getElementById('location').value = ''
        document.getElementById('website').value = ''
        document.getElementById('summary').value = ''

        // 更新字符计数器
        updateCharCounter(document.getElementById('summary'))

        // 更新预览和进度
        updatePreview()
        updateProgress()
    }
}

// 清空教育经历
function clearEducation () {
    if (confirm('确定要清空所有教育经历吗？此操作不可撤销。')) {
        const container = document.getElementById('education-container')

        // 清空所有教育项目
        container.innerHTML = ''

        // 添加一个空的教育项目
        addEducation()

        // 更新预览和进度
        updatePreview()
        updateProgress()
    }
}

// 清空工作经验
function clearExperience () {
    if (confirm('确定要清空所有工作经验吗？此操作不可撤销。')) {
        const container = document.getElementById('experience-container')

        // 清空所有工作经验项目
        container.innerHTML = ''

        // 添加一个空的工作经验项目
        addExperience()

        // 更新预览和进度
        updatePreview()
        updateProgress()
    }
}

// 清空专业技能
function clearSkills () {
    if (confirm('确定要清空所有专业技能吗？此操作不可撤销。')) {
        // 清空所有技能分类
        document.getElementById('programming-skills').value = ''
        document.getElementById('framework-skills').value = ''
        document.getElementById('language-skills').value = ''
        document.getElementById('other-skills').value = ''

        // 更新预览和进度
        updatePreview()
        updateProgress()
    }
}

// 清空项目经验
function clearProjects () {
    if (confirm('确定要清空所有项目经验吗？此操作不可撤销。')) {
        const container = document.getElementById('projects-container')

        // 清空所有项目经验
        container.innerHTML = ''

        // 添加一个空的项目经验
        addProject()

        // 更新预览和进度
        updatePreview()
        updateProgress()
    }
}

// AI润色功能
async function polishSummaryWithAI () {
    const summaryTextarea = document.getElementById('summary')
    const polishBtn = document.getElementById('ai-polish-btn')
    const originalText = summaryTextarea.value.trim()

    if (!originalText) {
        showMessage('请先输入个人简介内容', 'warning')
        return
    }

    // 设置加载状态
    polishBtn.disabled = true
    polishBtn.classList.add('loading')
    polishBtn.querySelector('div').innerHTML = '润色中...'
    polishBtn.querySelector('i').className = 'fas fa-spinner'

    try {
        const polishedText = await callDeepSeekAPI(originalText)

        if (polishedText && polishedText !== originalText) {
            // 显示润色结果对比界面
            showPolishResult(originalText, polishedText, summaryTextarea)
        } else {
            showMessage('润色失败，请稍后重试', 'error')
        }
    } catch (error) {
        console.error('AI润色失败:', error)
        showMessage('润色失败：' + error.message, 'error')
    } finally {
        // 恢复按钮状态
        polishBtn.disabled = false
        polishBtn.classList.remove('loading')
        polishBtn.querySelector('div').innerHTML = 'AI润色'
        polishBtn.querySelector('i').className = 'fas fa-magic'
    }
}

// 调用DeepSeek API进行文本润色
async function callDeepSeekAPI (text) {
    const API_KEY = 'sk-ddb83434db56493c88c2cc500e9039bf'
    const API_URL = 'https://api.deepseek.com/v1/chat/completions'

    const prompt = `请帮我润色以下个人简介，使其更加专业、吸引人，突出个人优势和特色。要求：
1. 保持原意不变
2. 语言更加精炼、专业
3. 突出核心技能和优势
4. 增强表达的感染力
5. 字数控制在200字以内
6. 直接返回润色后的文本，不要添加任何解释

原文：${text}`

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: '你是一个专业的简历润色助手，擅长将普通的个人简介改写得更加专业和吸引人。'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 1000,
                temperature: 0.7
            })
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error('API错误详情:', errorText)
            throw new Error(`API请求失败: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()

        if (data.choices && data.choices[0] && data.choices[0].message) {
            return data.choices[0].message.content.trim()
        } else {
            throw new Error('API返回数据格式错误')
        }
    } catch (error) {
        console.error('DeepSeek API调用失败:', error)
        throw error
    }
}

// 教育经历润色API
async function callEducationAPI (text) {
    const API_KEY = 'sk-ddb83434db56493c88c2cc500e9039bf'
    const API_URL = 'https://api.deepseek.com/v1/chat/completions'

    const prompt = `请帮我润色以下教育经历的成就描述，使其更加专业、突出学术能力和成果。要求：
1. 保持原意不变
2. 突出学术成就和能力
3. 使用更专业的表达方式
4. 体现学习能力和专业素养
5. 字数控制在150字以内
6. 直接返回润色后的文本，不要添加任何解释

原文：${text}`

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: '你是一个专业的简历润色专家，擅长优化教育经历描述，突出学术成就和能力。'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 800,
                temperature: 0.7
            })
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error('API错误详情:', errorText)
            throw new Error(`API请求失败: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        if (data.choices && data.choices[0] && data.choices[0].message) {
            return data.choices[0].message.content.trim()
        } else {
            throw new Error('API返回数据格式错误')
        }
    } catch (error) {
        console.error('教育经历API调用失败:', error)
        throw error
    }
}

// 工作经验润色API
async function callExperienceAPI (text) {
    const API_KEY = 'sk-ddb83434db56493c88c2cc500e9039bf'
    const API_URL = 'https://api.deepseek.com/v1/chat/completions'

    const prompt = `请帮我润色以下工作经验描述，使其更加专业、突出工作成果和能力。要求：
1. 保持原意不变
2. 突出工作成果和贡献
3. 使用动作导向的表达方式
4. 体现专业能力和责任心
5. 量化成果（如有数据）
6. 字数控制在300字以内
7. 直接返回润色后的文本，不要添加任何解释

原文：${text}`

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: '你是一个专业的简历润色专家，擅长优化工作经验描述，突出工作成果和专业能力。'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 1200,
                temperature: 0.7
            })
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error('API错误详情:', errorText)
            throw new Error(`API请求失败: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        if (data.choices && data.choices[0] && data.choices[0].message) {
            return data.choices[0].message.content.trim()
        } else {
            throw new Error('API返回数据格式错误')
        }
    } catch (error) {
        console.error('工作经验API调用失败:', error)
        throw error
    }
}

// 专业技能润色API
async function callSkillsAPI (text, skillType) {
    const API_KEY = 'sk-ddb83434db56493c88c2cc500e9039bf'
    const API_URL = 'https://api.deepseek.com/v1/chat/completions'

    const skillTypeMap = {
        'programming': '编程语言',
        'framework': '框架/工具',
        'language': '语言能力',
        'other': '其他技能'
    }

    const skillTypeName = skillTypeMap[skillType] || '技能'

    const prompt = `请帮我润色以下${skillTypeName}描述，使其更加专业、准确。要求：
1. 保持原意不变
2. 使用更专业的技术术语
3. 按重要性和熟练度排序
4. 简洁明了，突出核心技能
5. 字数控制在100字以内
6. 直接返回润色后的文本，不要添加任何解释

原文：${text}`

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: '你是一个专业的简历润色专家，擅长优化技能描述，使其更加专业和准确。'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 600,
                temperature: 0.7
            })
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error('API错误详情:', errorText)
            throw new Error(`API请求失败: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        if (data.choices && data.choices[0] && data.choices[0].message) {
            return data.choices[0].message.content.trim()
        } else {
            throw new Error('API返回数据格式错误')
        }
    } catch (error) {
        console.error('专业技能API调用失败:', error)
        throw error
    }
}

// 项目经验润色API
async function callProjectAPI (text) {
    const API_KEY = 'sk-ddb83434db56493c88c2cc500e9039bf'
    const API_URL = 'https://api.deepseek.com/v1/chat/completions'

    const prompt = `请帮我润色以下项目经验描述，使其更加专业、突出技术能力和项目成果。要求：
1. 保持原意不变
2. 突出技术难点和解决方案
3. 强调个人贡献和成果
4. 体现技术能力和创新思维
5. 量化项目成果（如有数据）
6. 字数控制在250字以内
7. 直接返回润色后的文本，不要添加任何解释

原文：${text}`

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: '你是一个专业的简历润色专家，擅长优化项目经验描述，突出技术能力和项目成果。'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 1000,
                temperature: 0.7
            })
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error('API错误详情:', errorText)
            throw new Error(`API请求失败: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        if (data.choices && data.choices[0] && data.choices[0].message) {
            return data.choices[0].message.content.trim()
        } else {
            throw new Error('API返回数据格式错误')
        }
    } catch (error) {
        console.error('项目经验API调用失败:', error)
        throw error
    }
}

// 显示消息提示
function showMessage (message, type = 'info') {
    // 移除已存在的消息
    const existingMessage = document.querySelector('.message')
    if (existingMessage) {
        existingMessage.remove()
    }

    // 创建消息元素
    const messageEl = document.createElement('div')
    messageEl.className = `message ${type}`

    // 设置图标
    const iconClass = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle',
    }[type] || 'fa-info-circle'

    // 设置内容
    messageEl.innerHTML = `
        <i class="fas ${iconClass}"></i>
        <span>${message}</span>
    `

    // 添加到页面
    document.body.appendChild(messageEl)

    // 触发显示动画
    setTimeout(() => {
        messageEl.classList.add('show')
    }, 10)

    // 3秒后自动隐藏
    setTimeout(() => {
        hideMessage(messageEl)
    }, 3000)
}

// 隐藏消息
function hideMessage (messageEl) {
    if (messageEl && messageEl.parentNode) {
        messageEl.classList.remove('show')
        messageEl.classList.add('hide')

        // 等待动画完成后移除元素
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove()
            }
        }, 300)
    }
}
// 显示润色结果对比界面
function showPolishResult (originalText, polishedText, targetTextarea) {
    // 创建遮罩层
    const overlay = document.createElement('div')
    overlay.className = 'polish-overlay'

    // 创建对话框
    const dialog = document.createElement('div')
    dialog.className = 'polish-dialog'

    // 在showPolishResult函数中修改这部分代码
    dialog.innerHTML = `
<div class="polish-header">
    <h3><i class="fas fa-magic"></i> AI润色结果对比</h3>
    <button class="close-btn" id="polish-close-btn">
        <i class="fas fa-times"></i>
    </button>
</div>
<div class="polish-content">
    <div class="comparison-container">
        <div class="comparison-header">
            <div class="original-header" style="color:red; font-size:20px; font-weight:bold">原文
                <div class="original-text" style="color:black; font-weight:normal; text-indent:2em">${originalText}</div>
            </div>
            <div class="polished-header" style="color:red; font-size:20px; font-weight:bold">润色后
                <div class="polished-text" style="color:black; font-weight:normal; text-indent:2em">${polishedText}</div>
            </div>
        </div>
    </div>
</div>
<div class="polish-actions">
    <button class="btn-cancel" id="polish-cancel-btn">取消</button>
    <button class="btn-accept" id="polish-accept-btn">采用润色结果</button>
</div>
`

    overlay.appendChild(dialog)
    document.body.appendChild(overlay)

    // 添加按钮事件监听器
    const closeBtn = dialog.querySelector('#polish-close-btn')
    const cancelBtn = dialog.querySelector('#polish-cancel-btn')
    const acceptBtn = dialog.querySelector('#polish-accept-btn')

    closeBtn.addEventListener('click', () => {
        closePolishResult()
    })

    cancelBtn.addEventListener('click', () => {
        closePolishResult()
    })

    acceptBtn.addEventListener('click', () => {
        acceptPolishResult(polishedText, targetTextarea)
    })

    // 添加点击遮罩关闭功能
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closePolishResult()
        }
    })

    // 显示动画
    setTimeout(() => {
        overlay.classList.add('show')
    }, 10)
}
// 关闭润色结果对话框
function closePolishResult () {
    const overlay = document.querySelector('.polish-overlay')
    if (overlay) {
        overlay.classList.remove('show')
        setTimeout(() => {
            overlay.remove()
        }, 300)
    }
}

// 接受润色结果
function acceptPolishResult (polishedText, textarea) {
    if (textarea) {
        textarea.value = polishedText
        updateCharCounter(textarea)
        updatePreview()
        updateProgress()
        showMessage('内容已成功润色！', 'success')
    }
    closePolishResult()
}

// 将清空函数暴露为全局函数
window.clearPersonalInfo = clearPersonalInfo
window.clearEducation = clearEducation
window.clearExperience = clearExperience
window.clearSkills = clearSkills
window.clearProjects = clearProjects
// 教育经历润色API
async function polishEducationWithAI (button) {
    const textarea = button.parentElement.querySelector('.achievements')
    const originalText = textarea.value.trim()

    if (!originalText) {
        showMessage('请先输入教育成就内容', 'warning')
        return
    }

    // 设置加载状态
    button.disabled = true
    button.classList.add('loading')
    button.querySelector('div').innerHTML = '润色中...'
    button.querySelector('i').className = 'fas fa-spinner'

    try {
        const polishedText = await callEducationAPI(originalText)

        if (polishedText && polishedText !== originalText) {
            showPolishResult(originalText, polishedText, textarea)
        } else {
            showMessage('润色失败，请稍后重试', 'error')
        }
    } catch (error) {
        console.error('教育经历润色失败:', error)
        showMessage('润色失败，请检查网络连接', 'error')
    } finally {
        // 恢复按钮状态
        button.disabled = false
        button.classList.remove('loading')
        button.querySelector('div').innerHTML = 'AI润色'
        button.querySelector('i').className = 'fas fa-magic'
    }
}

// 工作经验润色API
async function polishExperienceWithAI (button) {
    const textarea = button.parentElement.querySelector('.description')
    const originalText = textarea.value.trim()

    if (!originalText) {
        showMessage('请先输入工作描述内容', 'warning')
        return
    }

    // 设置加载状态
    button.disabled = true
    button.classList.add('loading')
    button.querySelector('div').innerHTML = '润色中...'
    button.querySelector('i').className = 'fas fa-spinner'

    try {
        const polishedText = await callExperienceAPI(originalText)

        if (polishedText && polishedText !== originalText) {
            showPolishResult(originalText, polishedText, textarea)
        } else {
            showMessage('润色失败，请稍后重试', 'error')
        }
    } catch (error) {
        console.error('工作经验润色失败:', error)
        showMessage('润色失败，请检查网络连接', 'error')
    } finally {
        // 恢复按钮状态
        button.disabled = false
        button.classList.remove('loading')
        button.querySelector('div').innerHTML = 'AI润色'
        button.querySelector('i').className = 'fas fa-magic'
    }
}

// 专业技能润色API
async function polishSkillsWithAI (button) {
    const textarea = button.parentElement.querySelector('textarea')
    const skillType = button.getAttribute('data-skill-type')
    const originalText = textarea.value.trim()

    if (!originalText) {
        showMessage('请先输入技能内容', 'warning')
        return
    }

    // 设置加载状态
    button.disabled = true
    button.classList.add('loading')
    button.querySelector('div').innerHTML = '润色中...'
    button.querySelector('i').className = 'fas fa-spinner'

    try {
        const polishedText = await callSkillsAPI(originalText, skillType)

        if (polishedText && polishedText !== originalText) {
            showPolishResult(originalText, polishedText, textarea)
        } else {
            showMessage('润色失败，请稍后重试', 'error')
        }
    } catch (error) {
        console.error('专业技能润色失败:', error)
        showMessage('润色失败，请检查网络连接', 'error')
    } finally {
        // 恢复按钮状态
        button.disabled = false
        button.classList.remove('loading')
        button.querySelector('div').innerHTML = 'AI润色'
        button.querySelector('i').className = 'fas fa-magic'
    }
}

// 项目经验润色API
async function polishProjectWithAI (button) {
    const textarea = button.parentElement.querySelector('.project-description')
    const originalText = textarea.value.trim()

    if (!originalText) {
        showMessage('请先输入项目描述内容', 'warning')
        return
    }

    // 设置加载状态
    button.disabled = true
    button.classList.add('loading')
    button.querySelector('div').innerHTML = '润色中...'
    button.querySelector('i').className = 'fas fa-spinner'

    try {
        const polishedText = await callProjectAPI(originalText)

        if (polishedText && polishedText !== originalText) {
            showPolishResult(originalText, polishedText, textarea)
        } else {
            showMessage('润色失败，请稍后重试', 'error')
        }
    } catch (error) {
        console.error('项目经验润色失败:', error)
        showMessage('润色失败，请检查网络连接', 'error')
    } finally {
        // 恢复按钮状态
        button.disabled = false
        button.classList.remove('loading')
        button.querySelector('div').innerHTML = 'AI润色'
        button.querySelector('i').className = 'fas fa-magic'
    }
}

// 暴露全局函数
window.showPolishResult = showPolishResult
window.closePolishResult = closePolishResult
window.acceptPolishResult = acceptPolishResult
