@ECHO OFF
ECHO "������: ����㧪� �஥��..."
ECHO Start %time%
git pull origin master
ECHO "������: ��⠭���� ����ᨬ��⥩..."
npm i
ECHO "������: ��१���㧪� �஥��..."
pm2 reload 4 || true
ECHO End %time%
ECHO "������: �ᯥ譮 �믮�����."