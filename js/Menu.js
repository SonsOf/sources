function form_Menu(pr_regim)
{ 
    // Добавляем контейнер в окно
    win = new Ext.Window({
		header: false,
        width: 450,
        height: pr_regim == 1 ? 320 : pr_regim == 2 ? 410 : 320,
        closable: false,  
        bodyStyle: 'background: transparent; border: none;',  
		style: 'background: transparent; border: none;', 
        items: pr_regim == 1 ? 
		[{
			layout: 'table',
			bodyStyle: 'background: transparent; border: none;', 
			items:
			[{
				xtype:'button',
				iconCls:'icon_Profile',
				iconAlign:'top',
				cls: 'button_Style_Menu',
				width:200,
				height:200,
				html:'<span class="button_Content_Menu">Личный кабинет</span>',
				handler: function()
				{
					function_Menu(3);
				}
				
			},{
				xtype:'button',
				iconCls:'icon_Changing_User_Rights',
				iconAlign:'top',
				cls: 'button_Style_Menu',
				width:200,
				height:200,
				html:'<span class="button_Content_Menu">Администрирование</br>пользователей</span>',
				handler: function()
				{
					win.close();
					form_Administration();
				}
			}]            
		},{
			xtype:'button',
			iconCls:'icon_Exit',
			iconAlign:'left',
			cls: 'button_Style_Menu',
			width:430,
			height:80,
			html:'<span class="button_Content_Exit">Выход из профиля</span>',
			handler: function()
			{
				win.close();
				form_Autorization();

				var link = document.getElementById('theme-css');
                var dop_link = document.getElementById('dop_theme-css');

				link.href = '../ext4/ext4/resources/css/ext-all-neptune.css';
				dop_link.href = 'css/style_neptune.css';				

				window.USER = '';
			}
		}] : pr_regim == 2 ? [{
			layout: 'table',
			bodyStyle: 'background: transparent; border: none;', 
			items:
			[{
				xtype:'button',
				iconCls:'icon_Entrusted_By_Me',
				iconAlign:'top',
				cls: 'button_Style_Menu',
				width:200,
				height:200,
				html:'<span class="button_Content_Menu">Порученное мною</span>',
				handler: function()
				{
					function_Menu(1);
				}				
			},{
				xtype:'button',
				iconCls:'icon_Entrusted_To_Me',
				iconAlign:'top',
				cls: 'button_Style_Menu',
				width:200,
				height:200,
				html:'<span class="button_Content_Menu">Порученное мне</span>',
				handler: function()
				{
					function_Menu(2);
				}
			}]            
		},{
			xtype:'button',
			iconCls:'icon_Profile1',
			iconAlign:'left',
			cls: 'button_Style_Menu',
			width:430,
			height:80,
			html:'<span class="button_Content_Menu1">Личный кабинет</span>',
			handler: function()
			{
				function_Menu(3);
			}
			
		},{
			xtype:'button',
			iconCls:'icon_Exit',
			iconAlign:'left',
			cls: 'button_Style_Menu',
			width:430,
			height:80,
			html:'<span class="button_Content_Exit">Выход из профиля</span>',
			handler: function()
			{
				win.close();
				form_Autorization();

				var link = document.getElementById('theme-css');
                var dop_link = document.getElementById('dop_theme-css');

				link.href = '../ext4/ext4/resources/css/ext-all-neptune.css';
				dop_link.href = 'css/style_neptune.css';				

				window.USER = '';
			}
		}] : [{
			layout: 'table',
			bodyStyle: 'background: transparent; border: none;', 
			items:
			[{
				xtype:'button',
				iconCls:'icon_Profile',
				iconAlign:'top',
				cls: 'button_Style_Menu',
				width:200,
				height:200,
				html:'<span class="button_Content_Menu">Личный кабинет</span>',
				handler: function()
				{
					function_Menu(3);
				}
				
			},{
				xtype:'button',
				iconCls:'icon_Entrusted_To_Me',
				iconAlign:'top',
				cls: 'button_Style_Menu',
				width:200,
				height:200,
				html:'<span class="button_Content_Menu">Порученное мне</span>',
				handler: function()
				{
					function_Menu(2);
				}
			}]            
		},{
			xtype:'button',
			iconCls:'icon_Exit',
			iconAlign:'left',
			cls: 'button_Style_Menu',
			width:430,
			height:80,
			html:'<span class="button_Content_Exit">Выход из профиля</span>',
			handler: function()
			{
				win.close();
				form_Autorization();

				var link = document.getElementById('theme-css');
                var dop_link = document.getElementById('dop_theme-css');

				link.href = '../ext4/ext4/resources/css/ext-all-neptune.css';
				dop_link.href = 'css/style_neptune.css';				

				window.USER = '';
			}
		}],
        listeners:
        {
            beforeshow: function()
            {  
				var link = document.getElementById('theme-css');
                var dop_link = document.getElementById('dop_theme-css');

				if (USER.BACKGROUND === 'neptun') 
				{
					link.href = '../ext4/ext4/resources/css/ext-all-neptune.css';
					dop_link.href = 'css/style_neptune.css';
				} 
				else if (USER.BACKGROUND === 'dark') 
				{
					link.href = '../ext4/ext4/resources/css/ext-all-access.css';
					dop_link.href = 'css/style_access.css';
				} 
				else if (USER.BACKGROUND === 'gray') 
				{
					link.href = '../ext4/ext4/resources/css/ext-all-gray.css';
					dop_link.href = 'css/style_gray.css';
				}  
            }
        }
    });

	let cards = document.querySelectorAll(".cards");    
for( let i = 0; i < cards.length; i++){
    cards[i].onmousemove = e => {
        for(const card of document.getElementsByClassName("card")) {
            const rect = card.getBoundingClientRect(),
            x = e.clientX - rect.left,
            y = e.clientY - rect.top;
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        };
    }
}

    win.show();
}


function function_Menu(parameter_Menu)
{
    if(parameter_Menu == 1)
    {
        form_Entrusted_By_Me();
    }
    else if(parameter_Menu == 2)
    {
		form_Entrusted_To_Me();
    }
    else if(parameter_Menu == 3)
    {
        form_Profile(1);
    }
    else if(parameter_Menu == 4)
    {
		form_Reports();
    }
	else if(parameter_Menu == 5)
	{
		form_Division_Structure();
	}
    
    win.close();
}