$(document).ready(function(){
    showAllDoa()
    let screenWidth = $(window).width();
    if (screenWidth <= 513){
        $('.col-back').removeClass('col-5').addClass('col-4')
    }
})

const showAllDoa = d => {
    let doa = ``
    $.ajax({
        url: 'tahlil.json',
        success: response => {
            response.forEach(d => {
                doa += listDoa(d)
            });
            $('.content-doa').html(doa)
        }
    })
}

// --- FUNGSI YANG DIPERBAIKI ADA DI BAWAH INI ---
const listDoa = d => {
    // Bagian image ini sudah aman karena ada fallback jika d.image tidak ada
    const imageUrl = d.image || 'https://images.unsplash.com/photo-1519817650390-64a93db51149?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80';
    
    return `
    <div class="doa-card">
        <div class="doa-content-wrapper">
            {/* Menggunakan d.title untuk alt text */}
            <img src="${imageUrl}" alt="${d.title}" class="doa-image">
            
            {/* Menggunakan d.title (sebelumnya d.doa) */}
            <div class="doa-title">${d.id}. ${d.title}</div>
            
            {/* Menggunakan d.arabic (sebelumnya d.ayat) */}
            <div class="doa-arabic">${d.arabic}</div>
            
            {/* Menggunakan d.latin || '' agar tidak error jika key latin tidak ada */}
            <div class="doa-latin">${d.latin || ''}</div>
            
            {/* Menggunakan d.translation (sebelumnya d.artinya) */}
            <div class="doa-translation">${d.translation}</div>
        </div>
    </div>`
}
